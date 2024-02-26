<?php

namespace App\Controller;

use App\Entity\Building;
use App\Entity\User;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class BuildingController extends AbstractController
{
    #[Route('/api/building/list', name: 'building_list', methods: ['POST'])]
    public function index(#[CurrentUser()] User $user, Request $request): Response
    {
        $session = $request->getSession();
        $token = $request->headers->get('token_user');
        if (null === $user || !($token == $session->get("token_user"))) {
          return $this->json([
            'message' => 'missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $buildings = $user->getBuildings();
        return $this->json([
            'message' => 'ok',
            'list_building' => $buildings,
            ], Response::HTTP_OK);  
    }
    
    #[Route('/api/building/create', name: 'building_create', methods: ["POST"])]
    public function create(#[CurrentUser()] User $user, Request $request, EntityManagerInterface $manager): Response
    {
        $session = $request->getSession();
        $token = $request->headers->get('token_user');
        if (null === $user || !($token == $session->get("token_user"))) {
          return $this->json([
            'message' => 'missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $manager->getConnection()->beginTransaction();

        try{
            $jsonbody = $request->getContent();
            $body = json_decode($jsonbody, true);
            $building = new Building;
            $building->setName($body['name_building'])
            ->setUser($user);
            $manager->persist($building);
            $manager->flush();
            $manager->getConnection()->commit();
            return $this->json([
                'message' => 'building created',
                ], Response::HTTP_CREATED);
        } 
        catch (UniqueConstraintViolationException $e){
            $manager->getConnection()->rollBack();
            return $this->json([
                'message' => $e,
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}