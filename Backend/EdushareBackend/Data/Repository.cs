using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public class Repository
    {
        RepositoryContext ctx;

        public Repository(RepositoryContext ctx)
        {
            this.ctx = ctx;
        }

        public Test GetTest()
        {
            return ctx.Tests.FirstOrDefault();
        }

        public void AddTest(Test test)
        {
            ctx.Add(test);
            ctx.SaveChanges();
        }
    }
}
