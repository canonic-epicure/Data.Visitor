StartTest(function(t) {
    
	t.plan(1)
    
    var async0 = t.beginAsync()
    
    use('Data.Visitor', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(Data.Visitor, "Data.Visitor is here")
        
        
        var data1 = {}
        var data2 = []
        
        t.ok(data1 == Data.Visitor.my.visit(data1), "Visiting don't modify the data #1")
        t.ok(data2 == Data.Visitor.my.visit(data2), "Visiting don't modify the data #2")
        
        t.endAsync(async0)
    })
})    