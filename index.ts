/** Number grouping and readable scales supported by the package. */
export type NumberingSystem =
  | 'Indian'
  | 'Nepali'
  | 'Indian.readable'
  | 'Nepali.readable'
  | 'Indian.readable2'
  | 'Nepali.readable2'
  | 'Indian.readable.devanagari'
  | 'Nepali.readable.devanagari'
  | 'Chinese'
  | 'Japanese'
  | 'Korean'
  | 'France'
  | 'Germany'
  | 'Switzerland'
  | 'International';

type Grouping = { size: number; separator: string; initialGroupSize?: number };
type ReadableGroup = { value: string; label: string };

const INDIAN_GROUPING: Grouping = { size: 2, separator: ',', initialGroupSize: 3 };
const INTERNATIONAL_GROUPING: Grouping = { size: 3, separator: ',' };

/** Formats a value using the selected grouping or readable numbering system. */
export function formatNumber(value: number | string, system: NumberingSystem): string {
  switch (system) {
    case 'Indian.readable': return formatIndianReadable(value);
    case 'Nepali.readable': return formatNepaliReadable(value);
    case 'Indian.readable2': return formatIndianReadable2(value);
    case 'Nepali.readable2': return formatNepaliReadable2(value);
    case 'Indian.readable.devanagari': return formatIndianReadableDevanagari(value);
    case 'Nepali.readable.devanagari': return formatNepaliReadableDevanagari(value);
    default: return formatGroupedNumber(value, system);
  }
}

/** Formats Indian readable values with Thousand, Lakh, Crore and larger English scale names. */
export function formatIndianReadable(value: number | string): string {
  return formatReadableValue(value, ['Thousand', 'Lakh', 'Crore', 'Arab', 'Kharab'], 'english');
}

/** Formats Nepali readable values with Hajar, Lakh, Crore and larger romanized scale names. */
export function formatNepaliReadable(value: number | string): string {
  return formatReadableValue(value, ['Hajar', 'Lakh', 'Crore', 'Arab', 'Kharab'], 'roman');
}

/** Formats Indian readable variant two with Hajar and plural Indian scale labels. */
export function formatIndianReadable2(value: number | string): string {
  return formatReadableValue(value, ['Hajar', 'Lakh', 'Crore', 'Arab', 'Kharab'], 'englishPlural');
}

/** Formats Nepali readable variant two with Nepali romanized scale names. */
export function formatNepaliReadable2(value: number | string): string {
  return formatReadableValue(value, ['Hajar', 'Lakh', 'Karod', 'Arab', 'Kharab'], 'roman');
}

/** Formats Indian readable values with Devanagari digits and Hindi scale labels. */
export function formatIndianReadableDevanagari(value: number | string): string {
  return formatReadableValue(value, ['हजार', 'लाख', 'करोड़', 'अरब', 'खरब'], 'devanagari', '०१२३४५६७८९');
}

/** Formats Nepali readable values with Devanagari digits and Nepali scale labels. */
export function formatNepaliReadableDevanagari(value: number | string): string {
  return formatReadableValue(value, ['हजार', 'लाख', 'करोड', 'अर्ब', 'खर्ब'], 'devanagari', '०१२३४५६७८९');
}

/** Formats regular comma, space, or period grouped number systems. */
function formatGroupedNumber(value: number | string, system: NumberingSystem): string {
  const parsed = parseNumber(value);
  if (!parsed) return String(value).trim();
  const grouping = getGrouping(system);
  return `${parsed.sign}${groupDigits(parsed.integer, grouping)}${parsed.fraction}`;
}

/** Applies the selected readable scale names to a 3-then-2 grouped integer. */
function formatReadableValue(
  value: number | string,
  labels: string[],
  labelStyle: 'english' | 'englishPlural' | 'roman' | 'devanagari',
  digits?: string,
): string {
  const parsed = parseNumber(value);
  if (!parsed) return String(value).trim();

  const groups = readableGroups(parsed.integer, labels, labelStyle);
  const output = groups.map((group) => {
    const amount = digits ? replaceDigits(group.value, digits) : group.value;
    return group.label ? `${amount} ${group.label}` : amount;
  }).join(' ');
  const signedOutput = `${parsed.sign}${output}`;
  const fraction = digits ? replaceDigits(parsed.fraction, digits) : parsed.fraction;
  return `${signedOutput}${fraction}`;
}

/** Splits an integer into Indian scale groups and attaches labels to non-final groups. */
function readableGroups(
  integer: string,
  labels: string[],
  labelStyle: 'english' | 'englishPlural' | 'roman' | 'devanagari',
): ReadableGroup[] {
  const chunks: string[] = [];
  let end = integer.length;
  let groupSize = 3;

  while (end > 0) {
    const start = Math.max(0, end - groupSize);
    chunks.unshift(integer.slice(start, end));
    end = start;
    groupSize = 2;
  }

  return chunks.map((chunk, index) => {
    const scaleIndex = chunks.length - index - 1;
    const rawLabel = scaleIndex > 0 ? labels[scaleIndex - 1] ?? '' : '';
    const shouldPluralize = labelStyle === 'english' || (labelStyle === 'englishPlural' && rawLabel !== 'Hajar');
    const label = shouldPluralize && rawLabel
      ? pluralizeEnglishLabel(rawLabel, Number(chunk))
      : rawLabel;
    return { value: chunk, label };
  }).filter((group) => Number(group.value) !== 0);
}

/** Converts English scale labels to plural form when their amount is not one. */
function pluralizeEnglishLabel(label: string, amount: number): string {
  return amount === 1 ? label : `${label}s`;
}

/** Replaces Latin digits with the provided digit alphabet. */
function replaceDigits(value: string, digits: string): string {
  return value.replace(/\d/g, (digit) => digits[Number(digit)]);
}

/** Parses the supported signed integer and decimal input forms. */
function parseNumber(value: number | string): { sign: string; integer: string; fraction: string } | null {
  const match = String(value).trim().match(/^([+-]?)(\d+)(\.\d+)?$/);
  if (!match) return null;
  return { sign: match[1], integer: match[2], fraction: match[3] ?? '' };
}

/** Resolves the digit grouping rule for a standard numbering system. */
function getGrouping(system: NumberingSystem): Grouping {
  switch (system) {
    case 'Indian':
    case 'Nepali':
      return INDIAN_GROUPING;
    case 'Chinese':
    case 'Japanese':
    case 'Korean':
      return { size: 4, separator: ',' };
    case 'France':
      return { size: 3, separator: ' ' };
    case 'Germany':
      return { size: 3, separator: '.' };
    case 'Switzerland':
      return { size: 3, separator: "'" };
    case 'International':
      return INTERNATIONAL_GROUPING;
    default:
      return INTERNATIONAL_GROUPING;
  }
}

/** Adds separators between digit groups from right to left. */
function groupDigits(digits: string, grouping: Grouping): string {
  if (grouping.initialGroupSize != null) {
    if (digits.length <= grouping.initialGroupSize) return digits;
    const firstGroupEnd = digits.length - grouping.initialGroupSize;
    const precedingGroups = groupDigits(digits.slice(0, firstGroupEnd), { size: grouping.size, separator: grouping.separator });
    return `${precedingGroups}${grouping.separator}${digits.slice(firstGroupEnd)}`;
  }

  const groups: string[] = [];
  for (let end = digits.length; end > 0; end -= grouping.size) {
    groups.unshift(digits.slice(Math.max(0, end - grouping.size), end));
  }
  return groups.join(grouping.separator);
}
