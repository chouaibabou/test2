<?php

namespace CrudBundle\Services;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\HttpKernel\Kernel;


/**
 * Created by PhpStorm.
 * User: FAT3665
 * Date: 12/05/2017
 * Time: 17:02
 */
class Cmd
{


    private $kernel;

    /**
     * Cmd constructor.
     */
    public function __construct(Kernel $kernel)
    {
        $this->kernel = $kernel;
    }

    public function exec($var)
    {

        $application = new Application($this->kernel);
        $application->setAutoExit(false);

        $input = new ArrayInput($var);
        // You can use NullOutput() if you don't need the output
        $output = new BufferedOutput();
        $application->run($input, $output);

        // return the output, don't use if you used NullOutput()
        $content = $output->fetch();

        // return new Response(""), if you used NullOutput()
        return $content;
    }
}