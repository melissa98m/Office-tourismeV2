<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Type;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $types = DB::table('types')
            ->get()
            ->toArray();

        return response()->json([
            'status' => 'Success',
            'data' => $types
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
            'name_type' => 'required|max:100',
            'description_type' => 'nullable',
        ]);

        $type = Type::create([
            'name_type' => $request->name_type,
            'description_type' => $request->description_type
        ]);

        return response()->json([
            'status' => 'Success',
            'data' => $type,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param Type $type
     * @return JsonResponse
     */
    public function show(Type $type): JsonResponse
    {
        return response()->json($type);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Type $type
     * @return JsonResponse
     * @throws ValidationException
     */
    public function update(Request $request, Type $type): JsonResponse
    {
        $this->validate($request, [
            'name_type' => 'required|max:100',
            'description_type' => 'nullable'
        ]);

        $type->update([
            'name_type' => $request->name_type,
            'description_type' => $request->description_type
        ]);

        return response()->json([
            'data' => $type,
            'status' => 'Mise à jour avec success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Type $type
     * @return JsonResponse
     */
    public function destroy(Type $type): JsonResponse
    {
        $type->delete();

        return response()->json([
            'status' => 'Supprimer avec success'
        ]);
    }
}
