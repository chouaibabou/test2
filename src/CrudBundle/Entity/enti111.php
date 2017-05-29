<?php

namespace CrudBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * enti111
 *
 * @ORM\Table(name="enti111")
 * @ORM\Entity(repositoryClass="CrudBundle\Repository\enti111Repository")
 */
class enti111
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="dks", type="string", length=100, nullable=true, unique=false)
     */
    private $dks;

    /**
     * @var string
     *
     * @ORM\Column(name="kdlsjq", type="text")
     */
    private $kdlsjq;

    /**
     * @var string
     *
     * @ORM\Column(name="dlkslk", type="text")
     */
    private $dlkslk;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set dks
     *
     * @param string $dks
     *
     * @return enti111
     */
    public function setDks($dks)
    {
        $this->dks = $dks;

        return $this;
    }

    /**
     * Get dks
     *
     * @return string
     */
    public function getDks()
    {
        return $this->dks;
    }

    /**
     * Set kdlsjq
     *
     * @param string $kdlsjq
     *
     * @return enti111
     */
    public function setKdlsjq($kdlsjq)
    {
        $this->kdlsjq = $kdlsjq;

        return $this;
    }

    /**
     * Get kdlsjq
     *
     * @return string
     */
    public function getKdlsjq()
    {
        return $this->kdlsjq;
    }

    /**
     * Set dlkslk
     *
     * @param string $dlkslk
     *
     * @return enti111
     */
    public function setDlkslk($dlkslk)
    {
        $this->dlkslk = $dlkslk;

        return $this;
    }

    /**
     * Get dlkslk
     *
     * @return string
     */
    public function getDlkslk()
    {
        return $this->dlkslk;
    }
}

