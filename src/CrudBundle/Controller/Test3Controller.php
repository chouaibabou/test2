<?php

namespace CrudBundle\Controller;

use CrudBundle\Entity\Test3;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;use Symfony\Component\HttpFoundation\Request;

/**
 * Test3 controller.
 *
 * @Route("test3")
 */
class Test3Controller extends Controller
{
    /**
     * Lists all test3 entities.
     *
     * @Route("/", name="test3_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $test3s = $em->getRepository('CrudBundle:Test3')->findAll();

        return $this->render('test3/index.html.twig', array(
            'test3s' => $test3s,
        ));
    }

    /**
     * Creates a new test3 entity.
     *
     * @Route("/new", name="test3_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $test3 = new Test3();
        $form = $this->createForm('CrudBundle\Form\Test3Type', $test3);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($test3);
            $em->flush();

            return $this->redirectToRoute('test3_show', array('id' => $test3->getId()));
        }

        return $this->render('test3/new.html.twig', array(
            'test3' => $test3,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a test3 entity.
     *
     * @Route("/{id}", name="test3_show")
     * @Method("GET")
     */
    public function showAction(Test3 $test3)
    {
        $deleteForm = $this->createDeleteForm($test3);

        return $this->render('test3/show.html.twig', array(
            'test3' => $test3,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing test3 entity.
     *
     * @Route("/{id}/edit", name="test3_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Test3 $test3)
    {
        $deleteForm = $this->createDeleteForm($test3);
        $editForm = $this->createForm('CrudBundle\Form\Test3Type', $test3);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('test3_edit', array('id' => $test3->getId()));
        }

        return $this->render('test3/edit.html.twig', array(
            'test3' => $test3,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a test3 entity.
     *
     * @Route("/{id}", name="test3_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Test3 $test3)
    {
        $form = $this->createDeleteForm($test3);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($test3);
            $em->flush();
        }

        return $this->redirectToRoute('test3_index');
    }

    /**
     * Creates a form to delete a test3 entity.
     *
     * @param Test3 $test3 The test3 entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Test3 $test3)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('test3_delete', array('id' => $test3->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
