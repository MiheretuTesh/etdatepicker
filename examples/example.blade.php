<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ethiopian Datepicker Examples</title>
    
    <!-- Bootstrap for styling (optional) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    @stack('styles')
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4">Ethiopian Datepicker Examples</h1>
        
        <!-- Example 1: Basic Usage -->
        <div class="card mb-4">
            <div class="card-header">
                <h3>Example 1: Basic Usage</h3>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="basic-date" class="form-label">Select Date</label>
                    <x-ethiopian-datepicker 
                        name="basic_date"
                        id="basic-date"
                        placeholder="Select a date..."
                    />
                </div>
            </div>
        </div>
        
        <!-- Example 2: Ethiopian Calendar Only -->
        <div class="card mb-4">
            <div class="card-header">
                <h3>Example 2: Ethiopian Calendar Only</h3>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="ethiopian-only" class="form-label">Ethiopian Date</label>
                    <x-ethiopian-datepicker 
                        name="ethiopian_only"
                        id="ethiopian-only"
                        :show-gregorian="false"
                        :show-ethiopian="true"
                        default-calendar="ethiopian"
                        placeholder="የኢትዮጵያ ቀን ይምረጡ..."
                    />
                </div>
            </div>
        </div>
        
        <!-- Example 3: Gregorian Calendar Only -->
        <div class="card mb-4">
            <div class="card-header">
                <h3>Example 3: Gregorian Calendar Only</h3>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="gregorian-only" class="form-label">Gregorian Date</label>
                    <x-ethiopian-datepicker 
                        name="gregorian_only"
                        id="gregorian-only"
                        :show-gregorian="true"
                        :show-ethiopian="false"
                        default-calendar="gregorian"
                    />
                </div>
            </div>
        </div>
        
        <!-- Example 4: Form with Validation -->
        <div class="card mb-4">
            <div class="card-header">
                <h3>Example 4: Form with Validation</h3>
            </div>
            <div class="card-body">
                <form method="POST" action="/submit-date">
                    @csrf
                    
                    <div class="mb-3">
                        <label for="birth-date" class="form-label">Birth Date <span class="text-danger">*</span></label>
                        <x-ethiopian-datepicker 
                            name="birth_date"
                            id="birth-date"
                            :value="old('birth_date')"
                            :required="true"
                            classes="form-control"
                        />
                        @error('birth_date')
                            <div class="text-danger mt-1">{{ $message }}</div>
                        @enderror
                    </div>
                    
                    <div class="mb-3">
                        <label for="event-date" class="form-label">Event Date</label>
                        <x-ethiopian-datepicker 
                            name="event_date"
                            id="event-date"
                            :value="old('event_date')"
                            classes="form-control"
                            default-calendar="ethiopian"
                        />
                        @error('event_date')
                            <div class="text-danger mt-1">{{ $message }}</div>
                        @enderror
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
        
        <!-- Example 5: With JavaScript Interaction -->
        <div class="card mb-4">
            <div class="card-header">
                <h3>Example 5: With JavaScript Interaction</h3>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="interactive-date" class="form-label">Interactive Date</label>
                    <x-ethiopian-datepicker 
                        name="interactive_date"
                        id="interactive-date"
                        classes="form-control"
                    />
                </div>
                
                <div id="date-display" class="alert alert-info">
                    <h5>Selected Date Information:</h5>
                    <p>Ethiopian: <span id="eth-date">Not selected</span></p>
                    <p>Gregorian: <span id="greg-date">Not selected</span></p>
                </div>
            </div>
        </div>
        
        <!-- Example 6: Multiple Date Pickers -->
        <div class="card mb-4">
            <div class="card-header">
                <h3>Example 6: Date Range Selection</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="start-date" class="form-label">Start Date</label>
                        <x-ethiopian-datepicker 
                            name="start_date"
                            id="start-date"
                            classes="form-control"
                        />
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="end-date" class="form-label">End Date</label>
                        <x-ethiopian-datepicker 
                            name="end_date"
                            id="end-date"
                            classes="form-control"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS (optional) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    @stack('scripts')
    
    <script>
        // Example 5: JavaScript interaction
        document.addEventListener('DOMContentLoaded', function() {
            const interactiveDateInput = document.getElementById('interactive-date');
            
            if (interactiveDateInput && interactiveDateInput.ethiopianDatepicker) {
                // Override the onChange callback
                const originalOnChange = interactiveDateInput.ethiopianDatepicker.options.onChange;
                interactiveDateInput.ethiopianDatepicker.options.onChange = function(data) {
                    // Call original onChange if it exists
                    if (originalOnChange) {
                        originalOnChange(data);
                    }
                    
                    // Update display
                    document.getElementById('eth-date').textContent = 
                        `${data.ethiopian.day}/${data.ethiopian.month}/${data.ethiopian.year}`;
                    document.getElementById('greg-date').textContent = 
                        data.gregorian.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                };
            }
            
            // Example 6: Date range validation
            const startDate = document.getElementById('start-date');
            const endDate = document.getElementById('end-date');
            
            if (startDate && endDate) {
                startDate.addEventListener('change', function() {
                    // You can add validation logic here
                    console.log('Start date changed:', this.value);
                });
                
                endDate.addEventListener('change', function() {
                    // You can add validation logic here
                    console.log('End date changed:', this.value);
                });
            }
        });
    </script>
</body>
</html>
