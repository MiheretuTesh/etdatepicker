<?php

namespace EtDatepickerLaravel\EthiopianDatepicker\View\Components;

use Illuminate\View\Component;

class EthiopianDatepicker extends Component
{
    public $name;
    public $id;
    public $value;
    public $placeholder;
    public $required;
    public $showGregorian;
    public $showEthiopian;
    public $defaultCalendar;
    public $classes;

    public function __construct(
        $name = 'date',
        $id = null,
        $value = null,
        $placeholder = 'Select a date...',
        $required = false,
        $showGregorian = true,
        $showEthiopian = true,
        $defaultCalendar = 'gregorian',
        $classes = ''
    ) {
        $this->name = $name;
        $this->id = $id ?: $name;
        $this->value = $value;
        $this->placeholder = $placeholder;
        $this->required = $required;
        $this->showGregorian = $showGregorian;
        $this->showEthiopian = $showEthiopian;
        $this->defaultCalendar = $defaultCalendar;
        $this->classes = $classes;
    }

    public function render()
    {
        return view('ethiopian-datepicker::components.datepicker');
    }
}
