<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Example route
Route::middleware('api')->get('/example', function (Request $request) {
    return response()->json(['message' => 'Hello, API!']);
});

