<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Place extends Model
{
    use HasFactory;
    protected $fillable = ['name_place', 'description_place', 'image', 'type', 'address'];

    public function type(): BelongsTo
    {
        return $this->BelongsTo(Type::class, 'type');
    }

    public function address(): BelongsTo
    {
        return $this->BelongsTo(Address::class, 'address');
    }
}
