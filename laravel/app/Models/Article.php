<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    use HasFactory;

    protected $fillable = ['name_article', 'content_article', 'image', 'category', 'place'];

    public function category(): BelongsTo
    {
        return $this->BelongsTo(Category::class, 'category');
    }

    public function place(): BelongsTo
    {
        return $this->BelongsTo(Place::class, 'place');
    }
}
