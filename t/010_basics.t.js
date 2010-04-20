StartTest(function(t) {
    
	t.plan(15)
    
    var async0 = t.beginAsync()
    
    use('Data.Visitor', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(Data.Visitor, "Data.Visitor is here")
        
        
        var data1 = {}
        var data2 = []
        var data3 = 10
        var data4 = true
        
        t.ok(data1 === Data.Visitor.my.visit(data1), "Visiting don't modify the data #1")
        t.ok(data2 === Data.Visitor.my.visit(data2), "Visiting don't modify the data #2")
        t.ok(data3 === Data.Visitor.my.visit(data3), "Visiting don't modify the data #3")
        t.ok(data4 === Data.Visitor.my.visit(data4), "Visiting don't modify the data #4")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('N-arity')
        
        var res = Data.Visitor.my.visit(data1, data2, data3, data4)
        
        t.ok(data1 === res[0], "Visiting don't modify the data #1")
        t.ok(data2 === res[1], "Visiting don't modify the data #2")
        t.ok(data3 === res[2], "Visiting don't modify the data #3")
        t.ok(data4 === res[3], "Visiting don't modify the data #4")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Composite structures')
        
        var fooCounter          = 0
        var barCounter          = 0
        var instanceCounter     = 0
        var objectCounter       = 0
        var arrayCounter        = 0
        var valuesCounter       = 0
        
        
        Class('Custom.Visitor', {
            isa : Data.Visitor,
            
            before : {
                
                visitValue : function (value) {
                    if (value == 'foo') fooCounter++
                    if (value == 'bar') barCounter++
                    
                    valuesCounter++
                },
                
                
                visitArray      : function () { arrayCounter++ },
                
                visitInstance   : function () { instanceCounter++ },
                
                visitObject     : function () { objectCounter++ }
                
            }
        })
        
        Class('Test', {
            has : {
                foo : null
            }
        })
        
        var data5 = {
            foo : [ 
                'bar', 
                {
                    instance    : new Test({ foo : 1 }),
                    value       : null
                },
                {
                    foo         : 'bar'
                }
            ]
        }
        
        Custom.Visitor.my.visit(data5)
        
        t.ok(fooCounter         == 3, "Correct number of 'foo' visited")
        t.ok(barCounter         == 2, "Correct number of 'bar' visited")
        t.ok(arrayCounter       == 1, "Correct number of arrays visited")
        t.ok(objectCounter      == 5, "Correct number of objects visited")
        t.ok(instanceCounter    == 1, "Correct number of instances visited")
        t.ok(valuesCounter      == 9, "Correct number of values visited")
        
        
        
        t.endAsync(async0)
    })
})    