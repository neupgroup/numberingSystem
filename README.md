# @neup/numbering-system

Open source number grouping utilities for JavaScript and TypeScript.

## Usage

```ts
import { formatNumber } from './index';

formatNumber(123456789, 'Indian'); // "12,34,56,789"
formatNumber(123456789, 'Nepali'); // "12,34,56,789"
formatNumber(10250, 'Indian.readable'); // "10 Thousands 250"
formatNumber(1520321, 'Indian.readable'); // "15 Lakhs 20 Thousands 321"
formatNumber(10240, 'Indian.readable2'); // "10 Hajar 240"
formatNumber(1020240, 'Indian.readable2'); // "10 Lakhs 20 Hajar 240"
formatNumber(10250, 'Nepali.readable.devanagari'); // "१० हजार २५०"
formatNumber(1510250, 'Indian.readable.devanagari'); // "१५ लाख १० हजार २५०"
formatNumber(123456789, 'International'); // "123,456,789"
formatNumber(12345678, 'France'); // "12 345 678"
```

## Supported systems

| System | Example |
| --- | --- |
| Indian | `1,00,00,000` for `10000000` |
| Nepali | `1,00,00,000` for `10000000` |
| Indian.readable | `15 Lakhs 20 Thousands 321` for `1520321` |
| Nepali.readable | `15 Lakh 20 Hajar 321` for `1520321` |
| Indian.readable2 | `10 Lakhs 20 Hajar 240` for `1020240` |
| Nepali.readable2 | `10 Lakh 20 Hajar 240` for `1020240` |
| Indian.readable.devanagari | `१५ लाख १० हजार २५०` for `1510250` |
| Nepali.readable.devanagari | `१५ लाख १० हजार २५०` for `1510250` |
| Chinese | `1,2345,6789` |
| Japanese | `1,2345,6789` |
| Korean | `1,2345,6789` |
| France | `12 345 678` |
| Germany | `12.345.678` |
| Switzerland | `12'345'678` |
| International | `123,456,789` |

Indian and Nepali grouping both keep the final three digits together, then group
the remaining digits in pairs. International grouping keeps all groups at three
digits.

`formatNumber` accepts a finite number or a signed integer/decimal string. Decimal
digits and signs are preserved. Inputs that are not plain decimal values are
returned unchanged.

## License

MIT. See [LICENSE](./LICENSE).
