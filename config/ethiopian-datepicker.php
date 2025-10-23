<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Ethiopian Datepicker Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration options for the Ethiopian Datepicker package.
    |
    | Package: etdatepickerlaravel/ethiopian-datepicker
    | Author: EtDatepickerLaravel
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Default Calendar Type
    |--------------------------------------------------------------------------
    |
    | The default calendar type to show when the datepicker is initialized.
    | Options: 'gregorian', 'ethiopian'
    |
    */
    'default_calendar' => 'gregorian',

    /*
    |--------------------------------------------------------------------------
    | Show Calendar Switcher
    |--------------------------------------------------------------------------
    |
    | Whether to show both Gregorian and Ethiopian calendar options.
    |
    */
    'show_both_calendars' => true,

    /*
    |--------------------------------------------------------------------------
    | Date Format
    |--------------------------------------------------------------------------
    |
    | The default date format for displaying dates.
    |
    */
    'date_format' => [
        'gregorian' => 'Y-m-d',
        'ethiopian' => 'd/m/Y',
    ],

    /*
    |--------------------------------------------------------------------------
    | Language Settings
    |--------------------------------------------------------------------------
    |
    | Language settings for month and day names.
    |
    */
    'language' => [
        'month_names' => [
            'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
            'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagumen'
        ],
        'weekday_names' => [
            'amharic' => ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
            'transliterated' => ['Ehud', 'Segno', 'Maksegno', 'Rebue', 'Hamus', 'Arb', 'Kedame'],
            'english' => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        ],
        'use_amharic_numerals' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Styling Options
    |--------------------------------------------------------------------------
    |
    | CSS class customization options.
    |
    */
    'styles' => [
        'theme' => 'default', // Options: 'default', 'dark', 'minimal'
        'highlight_weekends' => true,
        'highlight_today' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Validation Rules
    |--------------------------------------------------------------------------
    |
    | Default validation rules for date inputs.
    |
    */
    'validation' => [
        'min_year' => 1900,
        'max_year' => 2100,
        'allow_future_dates' => true,
        'allow_past_dates' => true,
    ],
];
