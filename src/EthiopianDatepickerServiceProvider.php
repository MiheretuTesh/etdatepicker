<?php

namespace EtDatepickerLaravel\EthiopianDatepicker;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use EtDatepickerLaravel\EthiopianDatepicker\View\Components\EthiopianDatepicker;

class EthiopianDatepickerServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot()
    {
        // Load views
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'ethiopian-datepicker');

        // Register Blade components
        Blade::component('ethiopian-datepicker', EthiopianDatepicker::class);

        if ($this->app->runningInConsole()) {
            // Publish config
            $this->publishes([
                __DIR__.'/../config/ethiopian-datepicker.php' => config_path('ethiopian-datepicker.php'),
            ], 'ethiopian-datepicker-config');

            // Publish views
            $this->publishes([
                __DIR__.'/../resources/views' => resource_path('views/vendor/ethiopian-datepicker'),
            ], 'ethiopian-datepicker-views');

            // Publish assets
            $this->publishes([
                __DIR__.'/../resources/js' => public_path('vendor/ethiopian-datepicker/js'),
                __DIR__.'/../resources/css' => public_path('vendor/ethiopian-datepicker/css'),
            ], 'ethiopian-datepicker-assets');

            // Publish all
            $this->publishes([
                __DIR__.'/../config/ethiopian-datepicker.php' => config_path('ethiopian-datepicker.php'),
                __DIR__.'/../resources/views' => resource_path('views/vendor/ethiopian-datepicker'),
                __DIR__.'/../resources/js' => public_path('vendor/ethiopian-datepicker/js'),
                __DIR__.'/../resources/css' => public_path('vendor/ethiopian-datepicker/css'),
            ], 'ethiopian-datepicker');
        }
    }

    /**
     * Register the application services.
     */
    public function register()
    {
        // Merge config
        $this->mergeConfigFrom(
            __DIR__.'/../config/ethiopian-datepicker.php', 'ethiopian-datepicker'
        );

        // Register the main class to use with the facade
        $this->app->singleton('ethiopian-datepicker', function () {
            return new EthiopianCalendar();
        });
    }
}
