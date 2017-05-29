<?php
/**
 * Created by PhpStorm.
 * User: FAT3665
 * Date: 09/05/2017
 * Time: 14:54
 */

namespace CrudBundle\Form;


use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use \Symfony\Component\Form\Extension\Core\Type\TextType;


class EntityType extends AbstractType
{

    public function BuildForm(FormBuilderInterface $builder, array $options)
    {

        $builder->add('name', TextType::class, ['required' => false])
            ->add('att1', TextType::class, ['required' => false])
            ->add('att2', TextType::class, ['required' => false])
            ->add('att3', TextType::class, ['required' => false])
            ->add('save', SubmitType::class);
    }
}