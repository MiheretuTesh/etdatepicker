@props([
    'name' => 'date',
    'id' => null,
    'value' => null,
    'placeholder' => 'Select date',
    'required' => false,
    'calendarType' => 'ethiopian',
    'class' => ''
])

@php
    $id = $id ?? 'datepicker-' . uniqid();
@endphp

<input 
    type="text" 
    name="{{ $name }}"
    id="{{ $id }}"
    class="{{ $class }}"
    placeholder="{{ $placeholder }}"
    value="{{ $value }}"
    {{ $required ? 'required' : '' }}
    {{ $attributes }}
    data-ethiopian-datepicker
    data-calendar-type="{{ $calendarType }}"
/>

@once
    @push('styles')
        <link rel="stylesheet" href="{{ asset('vendor/ethiopian-datepicker/css/ethiopian-datepicker.css') }}">
    @endpush

    @push('scripts')
        <script src="{{ asset('vendor/ethiopian-datepicker/js/ethiopian-datepicker.js') }}"></script>
    @endpush
@endonce
