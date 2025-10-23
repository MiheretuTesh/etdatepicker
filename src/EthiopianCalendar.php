<?php

namespace EtDatepickerLaravel\EthiopianDatepicker;

use DateTime;

class EthiopianCalendar
{
    protected $monthNames = [
        'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
        'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagumen'
    ];

    protected $weekDayNames = [
        'እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'
    ];

    protected $weekDayNamesTranslit = [
        'Ehud', 'Segno', 'Maksegno', 'Rebue', 'Hamus', 'Arb', 'Kedame'
    ];

    protected $weekDayNamesShort = [
        'እ', 'ሰ', 'ማ', 'ረ', 'ሐ', 'ዓ', 'ቅ'
    ];

    /**
     * Check if Ethiopian year is leap year
     */
    public function isLeapYear($year)
    {
        return ($year % 4 === 3);
    }

    /**
     * Get days in Ethiopian month
     */
    public function getDaysInMonth($year, $month)
    {
        if ($month === 13) {
            return $this->isLeapYear($year) ? 6 : 5;
        }
        return 30;
    }

    /**
     * Convert Gregorian date to Ethiopian
     */
    public function toEthiopian($date)
    {
        if (is_string($date)) {
            $date = new DateTime($date);
        }

        $year = $date->format('Y');
        $month = $date->format('n');
        $day = $date->format('j');

        // Ethiopian new year starts around September 11 (or 12 in leap years)
        $newYearMonth = 9;
        $newYearDay = ($year % 4 === 0 && ($year % 100 !== 0 || $year % 400 === 0)) ? 12 : 11;

        if ($month < $newYearMonth || ($month === $newYearMonth && $day < $newYearDay)) {
            $ethYear = $year - 8;
        } else {
            $ethYear = $year - 7;
        }

        // Calculate Ethiopian month and day
        $startOfYear = new DateTime("$year-$newYearMonth-$newYearDay");
        $diff = $date->diff($startOfYear);
        $dayOfYear = $diff->days;

        if ($diff->invert === 0) {
            // Before Ethiopian new year
            $prevYear = $year - 1;
            $prevYearStart = new DateTime("$prevYear-$newYearMonth-$newYearDay");
            $adjustedDiff = $date->diff($prevYearStart);
            $adjustedDayOfYear = $adjustedDiff->days;
            $ethMonth = floor($adjustedDayOfYear / 30) + 1;
            $ethDay = ($adjustedDayOfYear % 30) + 1;
            if ($ethMonth > 13) $ethMonth = 13;
        } else {
            $ethMonth = floor($dayOfYear / 30) + 1;
            $ethDay = ($dayOfYear % 30) + 1;
            if ($ethMonth > 13) $ethMonth = 13;
        }

        // Adjust for Pagumen
        if ($ethMonth === 13 && $ethDay > $this->getDaysInMonth($ethYear, 13)) {
            $ethDay = $this->getDaysInMonth($ethYear, 13);
        }

        return [
            'year' => $ethYear,
            'month' => $ethMonth,
            'day' => $ethDay,
            'monthName' => $this->monthNames[$ethMonth - 1],
            'dayOfWeek' => $date->format('w'),
            'dayName' => $this->weekDayNamesTranslit[$date->format('w')]
        ];
    }

    /**
     * Convert Ethiopian date to Gregorian
     */
    public function toGregorian($ethYear, $ethMonth, $ethDay)
    {
        // Calculate the Gregorian year
        $gregYear = $ethYear + 7;

        // Ethiopian new year is around September 11
        $newYearMonth = 9;
        $newYearDay = ($gregYear % 4 === 0 && ($gregYear % 100 !== 0 || $gregYear % 400 === 0)) ? 12 : 11;

        // Calculate days from Ethiopian new year
        $daysFromNewYear = ($ethMonth - 1) * 30 + $ethDay - 1;

        // Create the Gregorian date
        $newYearDate = new DateTime("$gregYear-$newYearMonth-$newYearDay");
        $newYearDate->modify("+$daysFromNewYear days");

        return $newYearDate;
    }

    /**
     * Format Ethiopian date
     */
    public function format($ethDate, $format = 'full')
    {
        if ($format === 'full') {
            $dayOfWeek = $this->toGregorian($ethDate['year'], $ethDate['month'], $ethDate['day'])->format('w');
            $weekDayName = $this->weekDayNamesTranslit[$dayOfWeek];
            return "$weekDayName, {$ethDate['day']} {$this->monthNames[$ethDate['month'] - 1]} {$ethDate['year']}";
        } elseif ($format === 'short') {
            return "{$ethDate['day']}/{$ethDate['month']}/{$ethDate['year']}";
        } else {
            return "{$ethDate['day']} {$this->monthNames[$ethDate['month'] - 1]} {$ethDate['year']}";
        }
    }

    /**
     * Get today in Ethiopian calendar
     */
    public function today()
    {
        return $this->toEthiopian(new DateTime());
    }

    /**
     * Get month names
     */
    public function getMonthNames()
    {
        return $this->monthNames;
    }

    /**
     * Get weekday names
     */
    public function getWeekDayNames($type = 'translit')
    {
        switch ($type) {
            case 'amharic':
                return $this->weekDayNames;
            case 'short':
                return $this->weekDayNamesShort;
            default:
                return $this->weekDayNamesTranslit;
        }
    }
}
