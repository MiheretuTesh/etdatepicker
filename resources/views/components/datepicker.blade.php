@props([
    'name' => 'date',
    'id' => null,
    'value' => null,
    'placeholder' => 'Select a date...',
    'required' => false,
    'showGregorian' => true,
    'showEthiopian' => true,
    'defaultCalendar' => 'gregorian',
    'classes' => ''
])

@php
    $id = $id ?? $name;
@endphp

<div class="ethiopian-datepicker-component">
    @if($showGregorian && $showEthiopian)
        <div class="calendar-type-switcher">
            <button type="button" 
                    class="calendar-option {{ $defaultCalendar === 'gregorian' ? 'active' : '' }}"
                    data-calendar-type="gregorian"
                    onclick="switchCalendarType('{{ $id }}', 'gregorian')">
                Gregorian Calendar
            </button>
            <button type="button"
                    class="calendar-option {{ $defaultCalendar === 'ethiopian' ? 'active' : '' }}"
                    data-calendar-type="ethiopian"
                    onclick="switchCalendarType('{{ $id }}', 'ethiopian')">
                Ethiopian Calendar
            </button>
        </div>
    @endif

    <input type="text"
           name="{{ $name }}"
           id="{{ $id }}"
           value="{{ $value }}"
           placeholder="{{ $placeholder }}"
           {{ $required ? 'required' : '' }}
           class="{{ $classes }}"
           data-ethiopian-datepicker
           data-show-gregorian="{{ $showGregorian ? 'true' : 'false' }}"
           data-show-ethiopian="{{ $showEthiopian ? 'true' : 'false' }}"
           data-default-calendar="{{ $defaultCalendar }}"
           readonly>

    <!-- Hidden inputs for storing both calendar values -->
    <input type="hidden" name="{{ $name }}_ethiopian" id="{{ $id }}_ethiopian">
    <input type="hidden" name="{{ $name }}_gregorian" id="{{ $id }}_gregorian">
</div>

@once
    @push('styles')
        <link rel="stylesheet" href="{{ asset('vendor/ethiopian-datepicker/css/ethiopian-datepicker.css') }}">
        @if($showGregorian)
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
        @endif
    @endpush

    @push('scripts')
        @if($showGregorian)
            <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
        @endif
        <script src="{{ asset('vendor/ethiopian-datepicker/js/ethiopian-datepicker.js') }}"></script>
        <script>
            function switchCalendarType(id, type) {
                const component = document.getElementById(id).closest('.ethiopian-datepicker-component');
                const buttons = component.querySelectorAll('.calendar-option');
                buttons.forEach(btn => {
                    if (btn.dataset.calendarType === type) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
                
                // Trigger calendar type change
                const input = document.getElementById(id);
                if (input.ethiopianDatepicker) {
                    input.ethiopianDatepicker.switchCalendarType(type);
                }
            }
            
            document.addEventListener('DOMContentLoaded', function() {
                // Initialize all Ethiopian datepickers
                const inputs = document.querySelectorAll('[data-ethiopian-datepicker]');
                inputs.forEach(input => {
                    input.ethiopianDatepicker = new EthiopianDatepicker(input, {
                        onChange: function(data) {
                            // Update hidden inputs
                            const ethInput = document.getElementById(input.id + '_ethiopian');
                            const gregInput = document.getElementById(input.id + '_gregorian');
                            
                            if (ethInput) {
                                ethInput.value = `${data.ethiopian.year}-${data.ethiopian.month}-${data.ethiopian.day}`;
                            }
                            if (gregInput) {
                                gregInput.value = data.gregorian.toISOString().split('T')[0];
                            }
                            
                            // Dispatch change event
                            input.dispatchEvent(new Event('change'));
                        }
                    });
                });
            });
        </script>
    @endpush
@endonce
