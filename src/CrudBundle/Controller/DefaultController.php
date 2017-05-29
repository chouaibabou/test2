<?php

namespace CrudBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use CrudBundle\Form\EntityType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class DefaultController extends Controller
{

    /**
     * @Route("/", name="homepage")
     * @Method({"GET", "POST"})
     */
    public function indexAction(Request $request)
    {

        $form = $this->createForm(EntityType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {

            $nom = $form['name']->getData();
            $att1 = $form['att1']->getData();
            $att2 = $form['att2']->getData();
            $att3 = $form['att3']->getData();

            $v = array(

                'command' => 'generate:doctrine:entity',
                '--entity' => 'CrudBundle:' . $nom,
                '--fields' => $att1 . ':string(length=100 nullable=true unique=false) ' . $att2 . ':text ' . $att3 . ':text'
            );

            $cmd = $this->get('Cmd');
            return new Response($cmd->exec($v));

        }

        // On passe la méthode createView() du formulaire à la vue
        // afin qu'elle puisse afficher le formulaire toute seule
        return $this->render('default/CreateEntity.html.twig', array(
            'form' => $form->createView(),
        ));


    }

    /**
     * @Route("/CreateEntity", name="Creer_entites")
     * @Method({"GET", "POST"})
     */
    public function CreateEntity(Request $request)
    {

        $form = $this->createForm(EntityType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {

            $nom = $form['name']->getData();
            $att1 = $form['att1']->getData();
            $att2 = $form['att2']->getData();
            $att3 = $form['att3']->getData();

            $v = array(

                'command' => 'generate:doctrine:entity',
                '--entity' => 'CrudBundle:' . $nom,
                '--fields' => $att1 . ':string(length=100 nullable=true unique=false) ' . $att2 . ':text ' . $att3 . ':text'
            );

            $cmd = $this->get('Cmd');
            return new Response($cmd->exec($v));


        }

        // On passe la méthode createView() du formulaire à la vue
        // afin qu'elle puisse afficher le formulaire toute seule
        return $this->render('default/CreateEntity.html.twig', array(
            'form' => $form->createView(),
        ));
    }
}