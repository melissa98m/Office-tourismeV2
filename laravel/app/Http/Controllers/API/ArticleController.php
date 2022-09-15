<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $articles = Article::with(['place', 'category'])->get();

        return response()->json([
            'status' => 'Success',
            'data' => $articles
        ]);

    }

    public function sortByDate(): JsonResponse
    {
        $articles = Article::with(['place', 'category'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'Success',
            'data' => $articles
        ]);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $this->validate($request ,[
            'name_article' => 'required',
            'content_article' => 'required',
            'image' => 'image|nullable|max: 1999',
        ]);

        if ($request->hasFile('image')) {
            $filename = $this->getFilename($request);
        } else {
            $filename = Null;
        }

        $article = Article::create([
            'name_article' => $request->name_article,
            'content_article' => $request->content_article,
            'image' => $filename,
            'category' => $request->category,
            'place' => $request->place,
        ]);

        $article->category = $article->category()->get()[0];
        $article->place = $article->place()->get()[0];

        return response()->json([
            'status' => 'Success',
            'data' => $article,
        ]);
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Article  $article
     * @return \Illuminate\Http\Response
     */
    public function show(Article $article)
    {
        $article->category = $article->category()->get()[0];
        $article->place = $article->place()->get()[0];
        return response()->json($article);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  \App\Models\Article  $article
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Article $article)
    {
        $this->validate($request, [
            'name_article' => 'required',
            'content_article' => 'required',
            'image' => 'image|nullable|max: 5000',
        ]);

        if ($request->hasFile('image')) {
            if (Article::findOrFail($article->id)->image){
                Storage::delete("/public/uploads/articles".Article::findOrFail($article->id)->image);
            }
            $filename = $this->getFilename($request);
            $request->image = $filename;
        }

        if ($request->image == null){
            $request->image = Place::findOrFail($article->id)->image;
        }

        $article->update([
            'name_article' => $request->name_article,
            'content_article' => $request->content_article,
            'image' => $request->image,
            'category' => $request->category,
            'place' => $request->place,
        ]);

        $article->category = $article->category()->get()[0];
        $article->place = $article->place()->get()[0];

        return response()->json([
            'status' => 'Mise à jour avec success',
            'data' => $article,
            'request' => $request->image
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Article  $article
     * @return \Illuminate\Http\Response
     */
    public function destroy(Article $article)
    {
        if ($article->image){
            Storage::delete("/public/uploads/articles".$article->image);
        }

        $article->delete();

        return response()->json([
            'status' => 'Supprimer avec success'
        ]);
    }

/**
 * @param Request $request
 * @return string
 */
public function getFilename(Request $request): string
{
    $filenameWithExt = $request->file('image')->getClientOriginalName();
    $filenameWithoutExt = pathinfo($filenameWithExt, PATHINFO_FILENAME);
    $extension = $request->file('image')->getClientOriginalExtension();
    $filename = $filenameWithoutExt . '_' . time() . '.' . $extension;
    $path = $request->file('image')->storeAs('public/uploads/articles', $filename);
    return $filename;
}
}
