<?php

namespace CrudBundle\Controller;

use CrudBundle\Entity\enti111;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;use Symfony\Component\HttpFoundation\Request;

/**
 * Enti111 controller.
 *
 * @Route("enti111")
 */
class enti111Controller extends Controller
{
    /**
     * Lists all enti111 entities.
     *
     * @Route("/", name="enti111_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $enti111s = $em->getRepository('CrudBundle:enti111')->findAll();

        return $this->render('enti111/index.html.twig', array(
            'enti111s' => $enti111s,
        ));
    }

    /**
     * Creates a new enti111 entity.
     *
     * @Route("/new", name="enti111_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $enti111 = new Enti111();
        $form = $this->createForm('CrudBundle\Form\enti111Type', $enti111);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($enti111);
            $em->flush();

            return $this->redirectToRoute('enti111_show', array('id' => $enti111->getId()));
        }

        return $this->render('enti111/new.html.twig', array(
            'enti111' => $enti111,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a enti111 entity.
     *
     * @Route("/{id}", name="enti111_show")
     * @Method("GET")
     */
    public function showAction(enti111 $enti111)
    {
        $deleteForm = $this->createDeleteForm($enti111);

        return $this->render('enti111/show.html.twig', array(
            'enti111' => $enti111,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing enti111 entity.
     *
     * @Route("/{id}/edit", name="enti111_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, enti111 $enti111)
    {
        $deleteForm = $this->createDeleteForm($enti111);
        $editForm = $this->createForm('CrudBundle\Form\enti111Type', $enti111);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('enti111_edit', array('id' => $enti111->getId()));
        }

        return $this->render('enti111/edit.html.twig', array(
            'enti111' => $enti111,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a enti111 entity.
     *
     * @Route("/{id}", name="enti111_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, enti111 $enti111)
    {
        $form = $this->createDeleteForm($enti111);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($enti111);
            $em->flush();
        }

        return $this->redirectToRoute('enti111_index');
    }

    /**
     * Creates a form to delete a enti111 entity.
     *
     * @param enti111 $enti111 The enti111 entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(enti111 $enti111)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('enti111_delete', array('id' => $enti111->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
