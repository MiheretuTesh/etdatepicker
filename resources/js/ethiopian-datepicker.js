/**
 * Ethiopian Datepicker - Minimalistic Version with Fixed Leap Year
 */

class EthiopianDatepicker {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            calendarType: options.calendarType || 'ethiopian',
            onChange: options.onChange || null,
            dateFormat: options.dateFormat || 'DD/MM/YYYY',
            placeholder: options.placeholder || 'Select date',
            ...options
        };

        this.monthNames = [
            'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
            'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagumen'
        ];

        this.gregorianMonths = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        this.currentCalendarType = this.options.calendarType;
        this.selectedDate = null;
        this.currentYear = null;
        this.currentMonth = null;
        this.isOpen = false;

        this.init();
    }

    init() {
        const today = new Date();
        if (this.currentCalendarType === 'ethiopian') {
            const todayEth = this.toEthiopian(today);
            this.currentYear = todayEth.year;
            this.currentMonth = todayEth.month;
        } else {
            this.currentYear = today.getFullYear();
            this.currentMonth = today.getMonth() + 1;
        }

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
        this.calendar.innerHTML = `
            <div class="et-calendar-toggle">
                <button class="et-toggle-btn ${this.currentCalendarType === 'ethiopian' ? 'active' : ''}" data-type="ethiopian">
                    Ethiopian
                </button>
                <button class="et-toggle-btn ${this.currentCalendarType === 'gregorian' ? 'active' : ''}" data-type="gregorian">
                    Gregorian
                </button>
            </div>
            <div class="et-month-year-selector">
                <select class="et-select et-month-select">
                    ${this.getMonthOptions()}
                </select>
                <select class="et-select et-year-select">
                    ${this.getYearOptions()}
                </select>
            </div>
            <div class="et-calendar-header">
                <div class="et-calendar-nav">
                    <button class="et-prev-month" aria-label="Previous month">‹</button>
                    <button class="et-next-month" aria-label="Next month">›</button>
                </div>
            </div>
            <div class="et-calendar-grid">
                ${this.renderWeekDays()}
                ${this.renderDays()}
            </div>
        `;

        this.attachCalendarEvents();
    }

    getMonthOptions() {
        const months = this.currentCalendarType === 'ethiopian' ? this.monthNames : this.gregorianMonths;
        return months.map((month, index) => 
            `<option value="${index + 1}" ${this.currentMonth === index + 1 ? 'selected' : ''}>${month}</option>`
        ).join('');
    }

    getYearOptions() {
        const currentYear = this.currentYear;
        const startYear = currentYear - 50;
        const endYear = currentYear + 50;
        let options = '';
        
        for (let year = startYear; year <= endYear; year++) {
            options += `<option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>`;
        }
        return options;
    }

    renderWeekDays() {
        const days = this.currentCalendarType === 'ethiopian' ? 
            ['እ', 'ሰ', 'ማ', 'ረ', 'ሐ', 'ዓ', 'ቅ'] : 
            ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        
        return days.map(day => `<div class="et-calendar-weekday">${day}</div>`).join('');
    }

    renderDays() {
        if (this.currentCalendarType === 'ethiopian') {
            return this.renderEthiopianDays();
        } else {
            return this.renderGregorianDays();
        }
    }

    renderEthiopianDays() {
        const daysInMonth = this.getDaysInEthiopianMonth(this.currentYear, this.currentMonth);
        const firstDayOfWeek = this.getEthiopianDayOfWeek(this.currentYear, this.currentMonth, 1);
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

    renderGregorianDays() {
        const year = this.currentYear;
        const month = this.currentMonth - 1;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        let days = '';
        
        for (let i = 0; i < firstDay; i++) {
            days += '<div class="et-calendar-day disabled"></div>';
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isToday = today.toDateString() === currentDate.toDateString();
            const isSelected = this.selectedDate && 
                             this.selectedDate.toDateString() === currentDate.toDateString();
            
            days += `<div class="et-calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" 
                         data-year="${year}" 
                         data-month="${month + 1}" 
                         data-day="${day}">${day}</div>`;
        }
        
        return days;
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
    }

    attachCalendarEvents() {
        // Calendar type toggle
        this.calendar.querySelectorAll('.et-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.switchCalendarType(type);
            });
        });

        // Month/Year selectors
        const monthSelect = this.calendar.querySelector('.et-month-select');
        const yearSelect = this.calendar.querySelector('.et-year-select');

        monthSelect.addEventListener('change', (e) => {
            this.currentMonth = parseInt(e.target.value);
            this.renderCalendar();
        });

        yearSelect.addEventListener('change', (e) => {
            this.currentYear = parseInt(e.target.value);
            this.renderCalendar();
        });

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

    switchCalendarType(type) {
        if (this.currentCalendarType === type) return;

        this.currentCalendarType = type;
        const today = new Date();

        if (type === 'ethiopian') {
            const ethDate = this.toEthiopian(today);
            this.currentYear = ethDate.year;
            this.currentMonth = ethDate.month;
        } else {
            this.currentYear = today.getFullYear();
            this.currentMonth = today.getMonth() + 1;
        }

        this.renderCalendar();
    }

    navigateMonth(direction) {
        this.currentMonth += direction;

        if (this.currentCalendarType === 'ethiopian') {
            if (this.currentMonth > 13) {
                this.currentMonth = 1;
                this.currentYear++;
            } else if (this.currentMonth < 1) {
                this.currentMonth = 13;
                this.currentYear--;
            }
        } else {
            if (this.currentMonth > 12) {
                this.currentMonth = 1;
                this.currentYear++;
            } else if (this.currentMonth < 1) {
                this.currentMonth = 12;
                this.currentYear--;
            }
        }

        this.renderCalendar();
    }

    selectDate(year, month, day) {
        if (this.currentCalendarType === 'ethiopian') {
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
        } else {
            this.selectedDate = new Date(year, month - 1, day);
            this.element.value = this.formatGregorianDate(this.selectedDate);
            
            if (this.options.onChange) {
                const ethDate = this.toEthiopian(this.selectedDate);
                this.options.onChange({
                    ethiopian: ethDate,
                    gregorian: this.selectedDate,
                    formatted: this.element.value
                });
            }
        }

        this.closeCalendar();
    }

    formatDate(date) {
        const format = this.options.dateFormat;
        const day = String(date.day).padStart(2, '0');
        const month = String(date.month).padStart(2, '0');
        const year = date.year;

        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    }

    formatGregorianDate(date) {
        const format = this.options.dateFormat;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    }

    toggleCalendar() {
        this.isOpen = !this.isOpen;
        this.calendar.classList.toggle('active', this.isOpen);
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

    getEthiopianDayOfWeek(year, month, day) {
        // Calculate total days from Ethiopian epoch
        let totalDays = 0;
        
        // Add days for complete years
        for (let y = 1; y < year; y++) {
            totalDays += this.isEthiopianLeapYear(y) ? 366 : 365;
        }
        
        // Add days for complete months in current year
        for (let m = 1; m < month; m++) {
            totalDays += this.getDaysInEthiopianMonth(year, m);
        }
        
        // Add days in current month
        totalDays += day;
        
        // Ethiopian calendar epoch (1/1/1) was a Monday, so we add 1
        return (totalDays + 1) % 7;
    }

    toEthiopian(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // Ethiopian new year starts on September 11 (or 12 in Gregorian leap years)
        const newYearDay = this.isGregorianLeapYear(year) ? 12 : 11;

        // Determine Ethiopian year
        let ethYear;
        if (month < 9 || (month === 9 && day < newYearDay)) {
            ethYear = year - 8;
        } else {
            ethYear = year - 7;
        }

        // Calculate days from start of Ethiopian year
        let ethNewYear = new Date(year, 8, newYearDay); // September is month 8 (0-indexed)
        if (date < ethNewYear) {
            const prevYear = year - 1;
            const prevNewYearDay = this.isGregorianLeapYear(prevYear) ? 12 : 11;
            ethNewYear = new Date(prevYear, 8, prevNewYearDay);
            ethYear = year - 8;
        }

        const daysSinceNewYear = Math.floor((date - ethNewYear) / (1000 * 60 * 60 * 24));

        // Calculate Ethiopian month and day
        let ethMonth, ethDay;
        if (daysSinceNewYear < 360) {
            ethMonth = Math.floor(daysSinceNewYear / 30) + 1;
            ethDay = (daysSinceNewYear % 30) + 1;
        } else {
            // Pagumen (13th month)
            ethMonth = 13;
            ethDay = daysSinceNewYear - 359;
            const maxDays = this.getDaysInEthiopianMonth(ethYear, 13);
            if (ethDay > maxDays) {
                ethDay = maxDays;
            }
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

        // Calculate the Gregorian year
        let gregYear;
        if (ethMonth <= 4) {
            gregYear = ethYear + 7;
        } else {
            gregYear = ethYear + 8;
        }

        // Ethiopian new year (1 Meskerem) falls on September 11 (or 12 in leap years)
        const newYearDay = this.isGregorianLeapYear(gregYear) ? 12 : 11;

        // Calculate days from Ethiopian new year
        let daysFromNewYear = (ethMonth - 1) * 30 + ethDay - 1;
        if (ethMonth === 13) {
            daysFromNewYear = 360 + ethDay - 1;
        }

        // Create the Gregorian date
        const newYearDate = new Date(gregYear, 8, newYearDay); // September is month 8
        const gregorianDate = new Date(newYearDate.getTime() + daysFromNewYear * 24 * 60 * 60 * 1000);

        return gregorianDate;
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
