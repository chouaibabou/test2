<?php

namespace CrudBundle\Controller;

use CrudBundle\Entity\Test4;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;use Symfony\Component\HttpFoundation\Request;

/**
 * Test4 controller.
 *
 * @Route("test4")
 */
class Test4Controller extends Controller
{
    /**
     * Lists all test4 entities.
     *
     * @Route("/", name="test4_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $test4s = $em->getRepository('CrudBundle:Test4')->findAll();

        return $this->render('test4/index.html.twig', array(
            'test4s' => $test4s,
        ));
    }

    /**
     * Creates a new test4 entity.
     *
     * @Route("/new", name="test4_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $test4 = new Test4();
        $form = $this->createForm('CrudBundle\Form\Test4Type', $test4);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($test4);
            $em->flush();

            return $this->redirectToRoute('test4_show', array('id' => $test4->getId()));
        }

        return $this->render('test4/new.html.twig', array(
            'test4' => $test4,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a test4 entity.
     *
     * @Route("/{id}", name="test4_show")
     * @Method("GET")
     */
    public function showAction(Test4 $test4)
    {
        $deleteForm = $this->createDeleteForm($test4);

        return $this->render('test4/show.html.twig', array(
            'test4' => $test4,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing test4 entity.
     *
     * @Route("/{id}/edit", name="test4_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Test4 $test4)
    {
        $deleteForm = $this->createDeleteForm($test4);
        $editForm = $this->createForm('CrudBundle\Form\Test4Type', $test4);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('test4_edit', array('id' => $test4->getId()));
        }

        return $this->render('test4/edit.html.twig', array(
            'test4' => $test4,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a test4 entity.
     *
     * @Route("/{id}", name="test4_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Test4 $test4)
    {
        $form = $this->createDeleteForm($test4);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($test4);
            $em->flush();
        }

        return $this->redirectToRoute('test4_index');
    }

    /**
     * Creates a form to delete a test4 entity.
     *
     * @param Test4 $test4 The test4 entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Test4 $test4)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('test4_delete', array('id' => $test4->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
