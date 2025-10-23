# Ethiopian Datepicker for Laravel

A comprehensive Laravel package that provides Ethiopian calendar datepicker functionality with Gregorian calendar conversion. Perfect for applications that need to support Ethiopian date selection with accurate conversion between Ethiopian and Gregorian calendars.

## Features

- 📅 **Dual Calendar Support**: Switch between Ethiopian and Gregorian calendars
- 🔄 **Accurate Date Conversion**: Precise conversion between Ethiopian and Gregorian dates
- 🌍 **Localization**: Support for Amharic, transliterated, and English day/month names
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎨 **Customizable**: Configurable themes and styling options
- ⚡ **Laravel Integration**: Blade components and Laravel-specific features
- 🔧 **Easy Installation**: Simple composer installation and configuration

## Requirements

- PHP 7.4 or higher
- Laravel 8.0 or higher

## Installation

### Step 1: Install via Composer

```bash
composer require etdatepickerlaravel/ethiopian-datepicker
```

### Step 2: Publish Assets (Optional)

Publish the configuration file:

```bash
php artisan vendor:publish --tag=ethiopian-datepicker-config
```

Publish the assets (CSS and JavaScript):

```bash
php artisan vendor:publish --tag=ethiopian-datepicker-assets
```

Publish the views (if you want to customize them):

```bash
php artisan vendor:publish --tag=ethiopian-datepicker-views
```

Or publish everything at once:

```bash
php artisan vendor:publish --tag=ethiopian-datepicker
```

## Usage

### Basic Usage

#### Using Blade Component

```blade
<x-ethiopian-datepicker 
    name="birth_date"
    placeholder="Select your birth date"
    :required="true"
/>
```

#### With Custom Options

```blade
<x-ethiopian-datepicker 
    name="event_date"
    id="event-date-picker"
    placeholder="Select event date"
    :show-gregorian="true"
    :show-ethiopian="true"
    default-calendar="ethiopian"
    classes="form-control custom-class"
/>
```

### In Your Blade Layout

Make sure to include the styles and scripts in your layout:

```blade
<!DOCTYPE html>
<html>
<head>
    <!-- Other head elements -->
    @stack('styles')
</head>
<body>
    <!-- Your content -->
    
    @stack('scripts')
</body>
</html>
```

### Using in Forms

```blade
<form method="POST" action="/events">
    @csrf
    
    <div class="form-group">
        <label for="event_date">Event Date</label>
        <x-ethiopian-datepicker 
            name="event_date"
            :value="old('event_date')"
            :required="true"
        />
        @error('event_date')
            <span class="error">{{ $message }}</span>
        @enderror
    </div>
    
    <button type="submit">Save Event</button>
</form>
```

### JavaScript API

You can also initialize the datepicker programmatically:

```javascript
// Initialize Ethiopian datepicker
const datepicker = new EthiopianDatepicker(document.getElementById('my-date-input'), {
    showGregorian: true,
    showEthiopian: true,
    defaultCalendar: 'ethiopian',
    onChange: function(data) {
        console.log('Ethiopian Date:', data.ethiopian);
        console.log('Gregorian Date:', data.gregorian);
        console.log('Formatted:', data.formatted);
    }
});
```

### PHP Usage

You can also use the Ethiopian calendar conversion in your PHP code:

```php
use WorthyERP\EthiopianDatepicker\EthiopianCalendar;

$calendar = new EthiopianCalendar();

// Convert Gregorian to Ethiopian
$ethiopianDate = $calendar->toEthiopian(new DateTime('2024-01-15'));
// Returns: ['year' => 2016, 'month' => 5, 'day' => 6, 'monthName' => 'Tir', ...]

// Convert Ethiopian to Gregorian
$gregorianDate = $calendar->toGregorian(2016, 5, 6);
// Returns: DateTime object

// Get today in Ethiopian calendar
$today = $calendar->today();

// Format Ethiopian date
$formatted = $calendar->format($ethiopianDate, 'full');
// Returns: "Monday, 6 Tir 2016"
```

## Configuration

The configuration file `config/ethiopian-datepicker.php` allows you to customize:

- Default calendar type (Gregorian or Ethiopian)
- Date formats
- Language settings
- Styling options
- Validation rules

```php
return [
    'default_calendar' => 'gregorian',
    'show_both_calendars' => true,
    'date_format' => [
        'gregorian' => 'Y-m-d',
        'ethiopian' => 'd/m/Y',
    ],
    'language' => [
        'month_names' => [...],
        'weekday_names' => [...],
    ],
    // ... more options
];
```

## Component Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | string | 'date' | Input name attribute |
| `id` | string | null | Input ID (defaults to name) |
| `value` | string | null | Initial value |
| `placeholder` | string | 'Select a date...' | Placeholder text |
| `required` | boolean | false | Whether the field is required |
| `showGregorian` | boolean | true | Show Gregorian calendar option |
| `showEthiopian` | boolean | true | Show Ethiopian calendar option |
| `defaultCalendar` | string | 'gregorian' | Default calendar to display |
| `classes` | string | '' | Additional CSS classes |

## Ethiopian Calendar Information

The Ethiopian calendar has:
- **13 months**: 12 months of 30 days each, plus Pagumen (5 or 6 days)
- **Leap years**: Occur every 4 years (when year % 4 = 3)
- **New Year**: Meskerem 1 (around September 11 in Gregorian)
- **7-8 year difference**: Ethiopian year is 7-8 years behind Gregorian

### Month Names

1. Meskerem (መስከረም)
2. Tikimt (ጥቅምት)
3. Hidar (ኅዳር)
4. Tahsas (ታኅሣሥ)
5. Tir (ጥር)
6. Yekatit (የካቲት)
7. Megabit (መጋቢት)
8. Miazia (ሚያዝያ)
9. Ginbot (ግንቦት)
10. Sene (ሰኔ)
11. Hamle (ሐምሌ)
12. Nehase (ነሐሴ)
13. Pagumen (ጳጉሜን)

## Examples

### Example 1: Birth Date Field

```blade
<div class="form-group">
    <label>Birth Date</label>
    <x-ethiopian-datepicker 
        name="birth_date"
        placeholder="Select birth date"
        :show-gregorian="true"
        :show-ethiopian="true"
        default-calendar="ethiopian"
    />
</div>
```

### Example 2: Event Date with Validation

```blade
<x-ethiopian-datepicker 
    name="event_date"
    :value="$event->date ?? old('event_date')"
    :required="true"
    classes="@error('event_date') is-invalid @enderror"
/>
```

### Example 3: Ethiopian Only

```blade
<x-ethiopian-datepicker 
    name="ethiopian_date"
    :show-gregorian="false"
    :show-ethiopian="true"
    default-calendar="ethiopian"
/>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This package is open-sourced software licensed under the [MIT license](LICENSE).

## Credits

- Developed by EtDatepickerLaravel
- Ethiopian calendar conversion algorithms based on established conversion methods
- Inspired by the need for accurate Ethiopian date handling in Laravel applications

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/worthyerp/ethiopian-datepicker/issues) on GitHub.

## Changelog

### Version 1.0.0
- Initial release
- Ethiopian calendar support
- Gregorian calendar integration
- Blade component
- JavaScript API
- PHP conversion utilities
