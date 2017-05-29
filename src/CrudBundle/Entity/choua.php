<?php

namespace CrudBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * choua
 *
 * @ORM\Table(name="choua")
 * @ORM\Entity(repositoryClass="CrudBundle\Repository\chouaRepository")
 */
class choua
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
     * @ORM\Column(name="skjd", type="string", length=100, nullable=true, unique=false)
     */
    private $skjd;

    /**
     * @var string
     *
     * @ORM\Column(name="kldsj", type="text")
     */
    private $kldsj;

    /**
     * @var string
     *
     * @ORM\Column(name="lkskd", type="text")
     */
    private $lkskd;


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
     * Set skjd
     *
     * @param string $skjd
     *
     * @return choua
     */
    public function setSkjd($skjd)
    {
        $this->skjd = $skjd;

        return $this;
    }

    /**
     * Get skjd
     *
     * @return string
     */
    public function getSkjd()
    {
        return $this->skjd;
    }

    /**
     * Set kldsj
     *
     * @param string $kldsj
     *
     * @return choua
     */
    public function setKldsj($kldsj)
    {
        $this->kldsj = $kldsj;

        return $this;
    }

    /**
     * Get kldsj
     *
     * @return string
     */
    public function getKldsj()
    {
        return $this->kldsj;
    }

    /**
     * Set lkskd
     *
     * @param string $lkskd
     *
     * @return choua
     */
    public function setLkskd($lkskd)
    {
        $this->lkskd = $lkskd;

        return $this;
    }

    /**
     * Get lkskd
     *
     * @return string
     */
    public function getLkskd()
    {
        return $this->lkskd;
    }
}

