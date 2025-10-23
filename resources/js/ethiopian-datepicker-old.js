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

        this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.weekDaysEth = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];

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
        const month = this.currentMonth - 1; // JavaScript months are 0-indexed
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        let days = '';
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days += '<div class="et-calendar-day disabled"></div>';
        }
        
        // Add days of the month
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
        document.addEventListener('click', (event) => {
            if (!this.element.contains(event.target) && 
                !this.calendarContainer.contains(event.target)) {
                this.calendarContainer.classList.add('hidden');
            }
        });

        // Month/Year navigation
        const monthSelector = this.calendarContainer.querySelector('.month-selector');
        const yearSelector = this.calendarContainer.querySelector('.year-selector');
        
        monthSelector.addEventListener('change', () => {
            this.currentEthMonth = parseInt(monthSelector.value);
            this.renderEthiopianCalendar();
        });

        yearSelector.addEventListener('change', () => {
            this.currentEthYear = parseInt(yearSelector.value);
            this.renderEthiopianCalendar();
        });

        // Navigation buttons
        this.calendarContainer.querySelector('.prev-month').addEventListener('click', () => {
            this.currentEthMonth--;
            if (this.currentEthMonth < 1) {
                this.currentEthMonth = 13;
                this.currentEthYear--;
            }
            this.renderEthiopianCalendar();
        });

        this.calendarContainer.querySelector('.next-month').addEventListener('click', () => {
            this.currentEthMonth++;
            if (this.currentEthMonth > 13) {
                this.currentEthMonth = 1;
                this.currentEthYear++;
            }
            this.renderEthiopianCalendar();
        });

        this.calendarContainer.querySelector('.prev-year').addEventListener('click', () => {
            this.currentEthYear--;
            this.renderEthiopianCalendar();
        });

        this.calendarContainer.querySelector('.next-year').addEventListener('click', () => {
            this.currentEthYear++;
            this.renderEthiopianCalendar();
        });
    }

    renderEthiopianCalendar() {
        const calendarGrid = this.calendarContainer.querySelector('.calendar-grid');
        calendarGrid.innerHTML = '';

        // Add weekday headers
        const weekdayHeader = document.createElement('div');
        weekdayHeader.className = 'weekday-header';
        
        this.weekDayNamesShort.forEach((dayName, index) => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = dayName;
            dayHeader.title = this.weekDayNamesTranslit[index];
            weekdayHeader.appendChild(dayHeader);
        });
        
        calendarGrid.appendChild(weekdayHeader);

        // Create calendar body
        const calendarBody = document.createElement('div');
        calendarBody.className = 'calendar-days';
        
        const firstDayOfWeek = this.getFirstDayOfMonth(this.currentEthYear, this.currentEthMonth);
        const daysInMonth = this.getDaysInMonth(this.currentEthYear, this.currentEthMonth);
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell empty';
            calendarBody.appendChild(emptyCell);
        }
        
        // Create day cells
        const todayEth = this.toEthiopian(new Date());
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.textContent = day;
            
            const dayOfWeek = this.getDayOfWeek(this.currentEthYear, this.currentEthMonth, day);
            
            // Highlight weekends
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayCell.classList.add('weekend');
            }
            
            // Check if selected
            if (this.selectedEthiopianDate && 
                this.selectedEthiopianDate.year === this.currentEthYear && 
                this.selectedEthiopianDate.month === this.currentEthMonth && 
                this.selectedEthiopianDate.day === day) {
                dayCell.classList.add('selected');
            }
            
            // Check if today
            if (todayEth.year === this.currentEthYear && 
                todayEth.month === this.currentEthMonth && 
                todayEth.day === day) {
                dayCell.classList.add('today');
            }
            
            // Add click handler
            dayCell.addEventListener('click', () => {
                this.selectEthiopianDate(this.currentEthYear, this.currentEthMonth, day);
            });
            
            calendarBody.appendChild(dayCell);
        }
        
        calendarGrid.appendChild(calendarBody);
        
        // Update selectors
        this.updateMonthYearSelectors();
    }

    updateMonthYearSelectors() {
        const monthSelector = this.calendarContainer.querySelector('.month-selector');
        const yearSelector = this.calendarContainer.querySelector('.year-selector');
        
        // Populate month selector
        monthSelector.innerHTML = '';
        this.monthNames.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = month;
            option.selected = (index + 1) === this.currentEthMonth;
            monthSelector.appendChild(option);
        });
        
        // Populate year selector
        yearSelector.innerHTML = '';
        for (let y = this.currentEthYear - 10; y <= this.currentEthYear + 10; y++) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            option.selected = y === this.currentEthYear;
            yearSelector.appendChild(option);
        }
    }

    selectEthiopianDate(year, month, day) {
        this.selectedEthiopianDate = { year, month, day };
        
        // Convert to Gregorian
        const jsDate = this.toGregorian(year, month, day);
        
        // Format and set value
        const formatted = this.formatEthiopianDate(this.selectedEthiopianDate);
        this.element.value = formatted;
        
        // Trigger change event
        if (this.options.onChange) {
            this.options.onChange({
                ethiopian: this.selectedEthiopianDate,
                gregorian: jsDate,
                formatted: formatted
            });
        }
        
        // Close calendar
        this.calendarContainer.classList.add('hidden');
        
        // Re-render to show selection
        this.renderEthiopianCalendar();
    }

    formatEthiopianDate(ethDate) {
        return `${ethDate.day} ${this.monthNames[ethDate.month - 1]} ${ethDate.year}`;
    }

    // Ethiopian Calendar Conversion Methods
    isLeapYear(year) {
        return (year % 4 === 3);
    }

    getDaysInMonth(year, month) {
        if (month === 13) {
            return this.isLeapYear(year) ? 6 : 5;
        }
        return 30;
    }

    toEthiopian(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        let ethYear, ethMonth, ethDay;
        
        const newYearMonth = 9;
        const newYearDay = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 12 : 11;
        
        if (month < newYearMonth || (month === newYearMonth && day < newYearDay)) {
            ethYear = year - 8;
        } else {
            ethYear = year - 7;
        }
        
        const startOfYear = new Date(year, newYearMonth - 1, newYearDay);
        const dayOfYear = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24));
        
        if (dayOfYear < 0) {
            const prevYearStart = new Date(year - 1, newYearMonth - 1, newYearDay);
            const adjustedDayOfYear = Math.floor((date - prevYearStart) / (1000 * 60 * 60 * 24));
            ethMonth = Math.floor(adjustedDayOfYear / 30) + 1;
            ethDay = (adjustedDayOfYear % 30) + 1;
            if (ethMonth > 13) ethMonth = 13;
        } else {
            ethMonth = Math.floor(dayOfYear / 30) + 1;
            ethDay = (dayOfYear % 30) + 1;
            if (ethMonth > 13) ethMonth = 13;
        }
        
        if (ethMonth === 13 && ethDay > this.getDaysInMonth(ethYear, 13)) {
            ethDay = this.getDaysInMonth(ethYear, 13);
        }
        
        return { year: ethYear, month: ethMonth, day: ethDay };
    }

    toGregorian(ethYear, ethMonth, ethDay) {
        let gregYear = ethYear + 7;
        
        const newYearMonth = 9;
        const newYearDay = (gregYear % 4 === 0 && (gregYear % 100 !== 0 || gregYear % 400 === 0)) ? 12 : 11;
        
        let daysFromNewYear = (ethMonth - 1) * 30 + ethDay - 1;
        
        const newYearDate = new Date(gregYear, newYearMonth - 1, newYearDay);
        const resultDate = new Date(newYearDate.getTime() + daysFromNewYear * 24 * 60 * 60 * 1000);
        
        return resultDate;
    }

    getDayOfWeek(ethYear, ethMonth, ethDay) {
        const gregDate = this.toGregorian(ethYear, ethMonth, ethDay);
        return gregDate.getDay();
    }

    getFirstDayOfMonth(ethYear, ethMonth) {
        return this.getDayOfWeek(ethYear, ethMonth, 1);
    }

    initGregorianPicker() {
        if (typeof flatpickr !== 'undefined') {
            flatpickr(this.element, {
                dateFormat: 'Y-m-d',
                onChange: (selectedDates) => {
                    if (selectedDates.length > 0 && this.options.onChange) {
                        const ethDate = this.toEthiopian(selectedDates[0]);
                        this.options.onChange({
                            ethiopian: ethDate,
                            gregorian: selectedDates[0],
                            formatted: selectedDates[0].toISOString().split('T')[0]
                        });
                    }
                }
            });
        }
    }

    initEthiopianPicker() {
        // Ethiopian picker is already initialized through setupCalendarContainer
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
