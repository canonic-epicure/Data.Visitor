StartTest(function(t) {
    
	t.plan(1)
    
    var async0 = t.beginAsync()
    
    use('Data.Visitor', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(Data.Visitor, "Data.Visitor is here")
        
        
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
                
                visitNotSeenObject : function () { objectCounter++ }
                
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