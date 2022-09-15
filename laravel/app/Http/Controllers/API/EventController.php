<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $events = Event::with(['place'])->get();

        return response()->json([
            'status' => 'Success',
            'data' => $events
        ]);
    }

    public function sortByDateDesc(): JsonResponse
    {
        $events = Event::with(['place'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'Success',
            'data' => $events
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
            'name_event' => 'required|max:100',
            'description_event' => 'nullable',
            'date_start' => 'required',
            'date_end' => 'required',
        ]);

        $event = Event::create([
            'name_event' => $request->name_event,
            'description_event' => $request->description_event,
            'date_start' => $request->date_start,
            'date_end' => $request->date_end,
            'place' => $request->place,
        ]);

        $event->place = $event->place()->get()[0];
        return response()->json([
            'status' => 'Success',
            'data' => $event,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param Event $event
     * @return JsonResponse
     */
    public function show(Event $event): JsonResponse
    {
        $event->place = $event->place()->get()[0];
        return response()->json($event);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Event $event
     * @return JsonResponse
     * @throws ValidationException
     */
    public function update(Request $request, Event $event): JsonResponse
    {
        $this->validate($request, [
            'name_event' => 'required|max:100',
            'description_event' => 'nullable',
            'date_start' => 'required',
            'date_end' => 'required',
        ]);

        $event->update([
            'name_event' => $request->name_event,
            'description_event' => $request->description_event,
            'date_start' => $request->date_start,
            'date_end' => $request->date_end,
            'place' => $request->place,
        ]);

        return response()->json([
            'status' => 'Mise à jour avec success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Event $event
     * @return JsonResponse
     */
    public function destroy(Event $event): JsonResponse
    {
        $event->delete();

        return response()->json([
            'status' => 'Supprimer avec success'
        ]);
    }
}
