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

    // Ethiopian epoch: September 11, 8 CE (Julian calendar)
    protected $ethiopianEpoch = 1724220.5;

    /**
     * Check if Ethiopian year is leap year
     * Ethiopian leap years occur every 4 years without exception
     * Year 3, 7, 11, 15, etc. are leap years
     */
    public function isLeapYear($year)
    {
        return ($year % 4 === 3);
    }

    /**
     * Check if Gregorian year is leap year
     */
    public function isGregorianLeapYear($year)
    {
        return ($year % 4 === 0 && ($year % 100 !== 0 || $year % 400 === 0));
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

        $year = (int)$date->format('Y');
        $month = (int)$date->format('n');
        $day = (int)$date->format('j');

        // Ethiopian new year starts on September 11 (or 12 in Gregorian leap years)
        $newYearDay = $this->isGregorianLeapYear($year) ? 12 : 11;

        // Determine Ethiopian year
        if ($month < 9 || ($month === 9 && $day < $newYearDay)) {
            $ethYear = $year - 8;
        } else {
            $ethYear = $year - 7;
        }

        // Calculate days from start of Ethiopian year
        $ethNewYear = new DateTime("$year-09-$newYearDay");
        if ($date < $ethNewYear) {
            // Date is before Ethiopian new year, so use previous year's new year
            $prevYear = $year - 1;
            $prevNewYearDay = $this->isGregorianLeapYear($prevYear) ? 12 : 11;
            $ethNewYear = new DateTime("$prevYear-09-$prevNewYearDay");
            $ethYear = $year - 8;
        }

        $diff = $ethNewYear->diff($date);
        $daysSinceNewYear = $diff->days;

        // Calculate Ethiopian month and day
        if ($daysSinceNewYear < 360) {
            $ethMonth = floor($daysSinceNewYear / 30) + 1;
            $ethDay = ($daysSinceNewYear % 30) + 1;
        } else {
            // Pagumen (13th month)
            $ethMonth = 13;
            $ethDay = $daysSinceNewYear - 359;
            $maxDays = $this->getDaysInMonth($ethYear, 13);
            if ($ethDay > $maxDays) {
                $ethDay = $maxDays;
            }
        }

        // Calculate day of week for Ethiopian calendar
        $dayOfWeek = $this->getEthiopianDayOfWeek($ethYear, $ethMonth, $ethDay);

        return [
            'year' => $ethYear,
            'month' => $ethMonth,
            'day' => $ethDay,
            'monthName' => $this->monthNames[$ethMonth - 1],
            'dayOfWeek' => $dayOfWeek,
            'dayName' => $this->weekDayNamesTranslit[$dayOfWeek]
        ];
    }

    /**
     * Convert Ethiopian date to Gregorian
     */
    public function toGregorian($ethYear, $ethMonth, $ethDay)
    {
        // Validate input
        if ($ethMonth < 1 || $ethMonth > 13) {
            throw new \InvalidArgumentException('Ethiopian month must be between 1 and 13');
        }
        
        $maxDays = $this->getDaysInMonth($ethYear, $ethMonth);
        if ($ethDay < 1 || $ethDay > $maxDays) {
            throw new \InvalidArgumentException("Ethiopian day must be between 1 and $maxDays for month $ethMonth");
        }

        // Calculate the Gregorian year
        // Ethiopian year starts in September, so:
        // - Months 1-4 (Meskerem to Tahsas) are in Gregorian year ethYear + 7
        // - Months 5-13 (Tir to Pagumen) are in Gregorian year ethYear + 8
        if ($ethMonth <= 4) {
            $gregYear = $ethYear + 7;
        } else {
            $gregYear = $ethYear + 8;
        }

        // Ethiopian new year (1 Meskerem) falls on September 11 (or 12 in leap years)
        $newYearDay = $this->isGregorianLeapYear($gregYear) ? 12 : 11;

        // Calculate days from Ethiopian new year
        $daysFromNewYear = ($ethMonth - 1) * 30 + $ethDay - 1;
        if ($ethMonth === 13) {
            // Adjust for Pagumen
            $daysFromNewYear = 360 + $ethDay - 1;
        }

        // Create the Gregorian date
        $newYearDate = new DateTime("$gregYear-09-$newYearDay");
        $newYearDate->modify("+$daysFromNewYear days");

        return $newYearDate;
    }

    /**
     * Calculate Ethiopian day of week
     * Ethiopian calendar follows a consistent pattern
     */
    public function getEthiopianDayOfWeek($year, $month, $day)
    {
        // Calculate total days from Ethiopian epoch
        $totalDays = 0;
        
        // Add days for complete years
        for ($y = 1; $y < $year; $y++) {
            $totalDays += $this->isLeapYear($y) ? 366 : 365;
        }
        
        // Add days for complete months in current year
        for ($m = 1; $m < $month; $m++) {
            $totalDays += $this->getDaysInMonth($year, $m);
        }
        
        // Add days in current month
        $totalDays += $day;
        
        // Ethiopian week starts on Sunday (0)
        // The epoch (1/1/1) was a Monday, so we add 1
        return ($totalDays + 1) % 7;
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
