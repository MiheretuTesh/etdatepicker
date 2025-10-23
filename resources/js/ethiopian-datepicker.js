/**
 * Ethiopian Datepicker JavaScript Library
 * (c) 2024 WorthyERP
 */

class EthiopianDatepicker {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            showGregorian: options.showGregorian !== false,
            showEthiopian: options.showEthiopian !== false,
            defaultCalendar: options.defaultCalendar || 'gregorian',
            onChange: options.onChange || null,
            dateFormat: options.dateFormat || 'YYYY-MM-DD',
            ...options
        };

        this.monthNames = [
            'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
            'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagumen'
        ];

        this.weekDayNames = ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
        this.weekDayNamesTranslit = ['Ehud', 'Segno', 'Maksegno', 'Rebue', 'Hamus', 'Arb', 'Kedame'];
        this.weekDayNamesShort = ['እ', 'ሰ', 'ማ', 'ረ', 'ሐ', 'ዓ', 'ቅ'];

        this.currentCalendarType = this.options.defaultCalendar;
        this.selectedEthiopianDate = null;
        this.currentEthYear = null;
        this.currentEthMonth = null;

        this.init();
    }

    init() {
        // Initialize current Ethiopian date
        const todayEth = this.toEthiopian(new Date());
        this.currentEthYear = todayEth.year;
        this.currentEthMonth = todayEth.month;

        // Set up the calendar container
        this.setupCalendarContainer();
        
        // Initialize based on default calendar type
        if (this.options.showGregorian && this.currentCalendarType === 'gregorian') {
            this.initGregorianPicker();
        } else if (this.options.showEthiopian) {
            this.initEthiopianPicker();
        }
    }

    setupCalendarContainer() {
        const wrapper = document.createElement('div');
        wrapper.className = 'ethiopian-datepicker-wrapper';
        
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(this.element);

        // Create calendar dropdown container
        this.calendarContainer = document.createElement('div');
        this.calendarContainer.className = 'ethiopian-calendar-dropdown hidden';
        this.calendarContainer.innerHTML = this.getCalendarHTML();
        wrapper.appendChild(this.calendarContainer);

        // Set up event listeners
        this.setupEventListeners();
    }

    getCalendarHTML() {
        return `
            <div class="ethiopian-calendar">
                <div class="ethiopian-calendar-header">
                    <div class="calendar-controls">
                        <button class="prev-year">‹‹</button>
                        <select class="year-selector"></select>
                        <button class="next-year">››</button>
                    </div>
                    <div class="calendar-controls">
                        <button class="prev-month">‹</button>
                        <select class="month-selector"></select>
                        <button class="next-month">›</button>
                    </div>
                </div>
                <div class="calendar-body">
                    <div class="calendar-grid"></div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Input click handler
        this.element.addEventListener('click', () => {
            this.calendarContainer.classList.toggle('hidden');
            if (!this.calendarContainer.classList.contains('hidden')) {
                this.renderEthiopianCalendar();
            }
        });

        // Close calendar when clicking outside
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
