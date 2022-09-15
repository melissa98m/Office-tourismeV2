<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;
    protected $fillable = ['name_event','description_event','place', 'date_start', 'date_end'];

    public function place(): BelongsTo
    {
        return $this->BelongsTo(Place::class, 'place');
    }
}
