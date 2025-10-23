/**
 * Ethiopian Datepicker - Simple Version (Ethiopian Calendar Only)
 */

class EthiopianDatepicker {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            onChange: options.onChange || null,
            dateFormat: options.dateFormat || 'DD/MM/YYYY',
            placeholder: options.placeholder || 'Select date',
            ...options
        };

        this.monthNames = [
            'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
            'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagumen'
        ];

        this.weekDays = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
        this.weekDaysShort = ['እ', 'ሰ', 'ማ', 'ረ', 'ሐ', 'ዓ', 'ቅ'];

        this.selectedDate = null;
        this.currentYear = null;
        this.currentMonth = null;
        this.isOpen = false;

        this.init();
    }

    init() {
        const today = new Date();
        const todayEth = this.toEthiopian(today);
        this.currentYear = todayEth.year;
        this.currentMonth = todayEth.month;

        this.setupCalendar();
    }

    setupCalendar() {
        const wrapper = document.createElement('div');
        wrapper.className = 'et-datepicker-wrapper';
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(this.element);

        this.element.classList.add('et-datepicker-input');
        this.element.placeholder = this.options.placeholder;
        this.element.readOnly = true;

        this.calendar = document.createElement('div');
        this.calendar.className = 'et-calendar-popup';
        wrapper.appendChild(this.calendar);

        this.renderCalendar();
        this.attachEvents();
    }

    renderCalendar() {
        const monthYear = `${this.monthNames[this.currentMonth - 1]} ${this.currentYear}`;
        
        this.calendar.innerHTML = `
            <div class="et-calendar-header">
                <button class="et-nav-btn et-prev-month" aria-label="Previous month">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <div class="et-calendar-title">${monthYear}</div>
                <button class="et-nav-btn et-next-month" aria-label="Next month">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            </div>
            <div class="et-calendar-grid">
                ${this.renderWeekDays()}
                ${this.renderDays()}
            </div>
        `;

        this.attachCalendarEvents();
    }

    renderWeekDays() {
        return this.weekDaysShort.map(day => 
            `<div class="et-calendar-weekday">${day}</div>`
        ).join('');
    }

    renderDays() {
        const daysInMonth = this.getDaysInEthiopianMonth(this.currentYear, this.currentMonth);
        const firstDayOfWeek = this.getEthiopianFirstDayOfWeek(this.currentYear, this.currentMonth);
        const today = this.toEthiopian(new Date());
        
        let days = '';
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDayOfWeek; i++) {
            days += '<div class="et-calendar-day disabled"></div>';
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = today.year === this.currentYear && 
                          today.month === this.currentMonth && 
                          today.day === day;
            const isSelected = this.selectedDate && 
                             this.selectedDate.year === this.currentYear && 
                             this.selectedDate.month === this.currentMonth && 
                             this.selectedDate.day === day;
            
            days += `<div class="et-calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" 
                         data-year="${this.currentYear}" 
                         data-month="${this.currentMonth}" 
                         data-day="${day}">${day}</div>`;
        }
        
        return days;
    }

    getEthiopianFirstDayOfWeek(year, month) {
        // Get the day of week for the first day of the month
        const gregorian = this.toGregorian(year, month, 1);
        return gregorian.getDay();
    }

    attachEvents() {
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCalendar();
        });

        document.addEventListener('click', (e) => {
            if (!this.calendar.contains(e.target) && e.target !== this.element) {
                this.closeCalendar();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCalendar();
            }
        });
    }

    attachCalendarEvents() {
        // Navigation buttons
        this.calendar.querySelector('.et-prev-month').addEventListener('click', () => {
            this.navigateMonth(-1);
        });

        this.calendar.querySelector('.et-next-month').addEventListener('click', () => {
            this.navigateMonth(1);
        });

        // Day selection
        this.calendar.querySelectorAll('.et-calendar-day:not(.disabled)').forEach(day => {
            day.addEventListener('click', (e) => {
                const year = parseInt(e.target.dataset.year);
                const month = parseInt(e.target.dataset.month);
                const dayNum = parseInt(e.target.dataset.day);
                this.selectDate(year, month, dayNum);
            });
        });
    }

    navigateMonth(direction) {
        this.currentMonth += direction;

        if (this.currentMonth > 13) {
            this.currentMonth = 1;
            this.currentYear++;
        } else if (this.currentMonth < 1) {
            this.currentMonth = 13;
            this.currentYear--;
        }

        this.renderCalendar();
    }

    selectDate(year, month, day) {
        this.selectedDate = { year, month, day };
        const gregorian = this.toGregorian(year, month, day);
        this.element.value = this.formatDate({ year, month, day });
        
        if (this.options.onChange) {
            this.options.onChange({
                ethiopian: { year, month, day },
                gregorian: gregorian,
                formatted: this.element.value
            });
        }

        this.closeCalendar();
    }

    formatDate(date) {
        const format = this.options.dateFormat;
        const day = String(date.day).padStart(2, '0');
        const month = String(date.month).padStart(2, '0');
        const year = date.year;
        const monthName = this.monthNames[date.month - 1];

        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year)
            .replace('MMM', monthName);
    }

    toggleCalendar() {
        this.isOpen = !this.isOpen;
        this.calendar.classList.toggle('active', this.isOpen);
        if (this.isOpen) {
            this.renderCalendar();
        }
    }

    closeCalendar() {
        this.isOpen = false;
        this.calendar.classList.remove('active');
    }

    // Ethiopian Calendar Conversion Methods
    isEthiopianLeapYear(year) {
        return (year % 4 === 3);
    }

    isGregorianLeapYear(year) {
        return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    }

    getDaysInEthiopianMonth(year, month) {
        if (month === 13) {
            return this.isEthiopianLeapYear(year) ? 6 : 5;
        }
        return 30;
    }

    toEthiopian(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // Ethiopian new year starts on September 11 (or 12 in Gregorian leap years)
        const newYearDay = this.isGregorianLeapYear(year) ? 12 : 11;

        // Determine Ethiopian year and new year date
        let ethNewYear = new Date(year, 8, newYearDay); // September is month 8 (0-indexed)
        let ethYear;
        
        if (date < ethNewYear) {
            // Date is before this year's Ethiopian new year
            // So it belongs to the previous Ethiopian year
            ethYear = year - 8;
            // Calculate from previous year's new year
            const prevYear = year - 1;
            const prevNewYearDay = this.isGregorianLeapYear(prevYear) ? 12 : 11;
            ethNewYear = new Date(prevYear, 8, prevNewYearDay);
        } else {
            // Date is on or after this year's Ethiopian new year
            ethYear = year - 7;
        }

        let daysSinceNewYear = Math.floor((date - ethNewYear) / (1000 * 60 * 60 * 24));
        
        // Check if we've exceeded the current Ethiopian year
        const daysInEthYear = this.isEthiopianLeapYear(ethYear) ? 366 : 365;
        
        if (daysSinceNewYear >= daysInEthYear) {
            // We've moved into the next Ethiopian year
            // Recalculate from the next year's start date
            ethYear++;
            const nextGregYear = ethYear + 7;
            const nextNewYearDay = this.isGregorianLeapYear(nextGregYear) ? 12 : 11;
            ethNewYear = new Date(nextGregYear, 8, nextNewYearDay);
            daysSinceNewYear = Math.floor((date - ethNewYear) / (1000 * 60 * 60 * 24));
            
            // Since we're before the new year, count backwards
            const prevYearDays = this.isEthiopianLeapYear(ethYear - 1) ? 366 : 365;
            daysSinceNewYear = prevYearDays + daysSinceNewYear;
            ethYear--;
        }

        // Calculate Ethiopian month and day
        let ethMonth, ethDay;
        if (daysSinceNewYear < 360) {
            ethMonth = Math.floor(daysSinceNewYear / 30) + 1;
            ethDay = (daysSinceNewYear % 30) + 1;
        } else {
            // Pagumen (13th month)
            ethMonth = 13;
            ethDay = daysSinceNewYear - 359;
        }

        return {
            year: ethYear,
            month: ethMonth,
            day: ethDay,
            monthName: this.monthNames[ethMonth - 1]
        };
    }

    toGregorian(ethYear, ethMonth, ethDay) {
        // Validate input
        if (ethMonth < 1 || ethMonth > 13) {
            throw new Error('Ethiopian month must be between 1 and 13');
        }
        
        const maxDays = this.getDaysInEthiopianMonth(ethYear, ethMonth);
        if (ethDay < 1 || ethDay > maxDays) {
            throw new Error(`Ethiopian day must be between 1 and ${maxDays} for month ${ethMonth}`);
        }

        // Use a known reference point: 1 Meskerem 2017 (Ethiopian) = September 12, 2024 (Gregorian)
        const referenceEthYear = 2017;
        const referenceGregDate = new Date(2024, 8, 12); // September 12, 2024
        
        if (ethYear >= referenceEthYear) {
            // Calculate days from reference year to target year
            const yearsDiff = ethYear - referenceEthYear;
            let leapYearsInRange = 0;
            for (let y = referenceEthYear; y < ethYear; y++) {
                if (this.isEthiopianLeapYear(y)) {
                    leapYearsInRange++;
                }
            }
            const regularYearsInRange = yearsDiff - leapYearsInRange;
            const daysFromReference = (regularYearsInRange * 365) + (leapYearsInRange * 366);
            
            // Add days within the current year
            let daysInCurrentYear = (ethMonth - 1) * 30 + ethDay - 1;
            if (ethMonth === 13) {
                daysInCurrentYear = 360 + ethDay - 1;
            }
            
            const totalDays = daysFromReference + daysInCurrentYear;
            const result = new Date(referenceGregDate.getTime() + totalDays * 24 * 60 * 60 * 1000);
            return result;
        } else {
            // Calculate days backwards from reference year
            const yearsDiff = referenceEthYear - ethYear;
            let leapYearsInRange = 0;
            for (let y = ethYear; y < referenceEthYear; y++) {
                if (this.isEthiopianLeapYear(y)) {
                    leapYearsInRange++;
                }
            }
            const regularYearsInRange = yearsDiff - leapYearsInRange;
            const daysFromReference = (regularYearsInRange * 365) + (leapYearsInRange * 366);
            
            // Subtract days within the current year
            let daysInCurrentYear = (ethMonth - 1) * 30 + ethDay - 1;
            if (ethMonth === 13) {
                daysInCurrentYear = 360 + ethDay - 1;
            }
            
            const totalDays = daysFromReference - daysInCurrentYear;
            const result = new Date(referenceGregDate.getTime() - totalDays * 24 * 60 * 60 * 1000);
            return result;
        }
    }
}

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('[data-ethiopian-datepicker]');
    elements.forEach(element => {
        new EthiopianDatepicker(element, {
            ...element.dataset
        });
    });
});

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthiopianDatepicker;
}

// Export for window
window.EthiopianDatepicker = EthiopianDatepicker;
