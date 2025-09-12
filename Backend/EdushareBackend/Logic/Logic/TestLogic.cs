using Data;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic.Logic
{
    public class TestLogic
    {
        Repository repo;

        public TestLogic(Repository repo)
        {
            this.repo = repo;
        }

        public Test GetTest()
        { 
            Test test = repo.GetTest();

            if (test is null)
            {
                repo.AddTest(new Test("Test successful"));
            }

            return repo.GetTest();
        }
    }
}
