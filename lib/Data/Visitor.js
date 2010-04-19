Class('Data.Visitor', {
    
    
    has : {
        ID                      : null,
        
        seen                    : Joose.I.Object
    },
    
        
    methods : {
        
        visit : function () {
            var res     = []
            var seen    = this.seen
            
            
            
            Joose.A.each(arguments, function (value) {
                
                if (value && typeof value == 'object' || typeof value == 'function') {
                    
                    var ref = value.__REF__
                    
                    if (!ref) ref = value.__REF__ = this.my.getID()
                    
                    if (seen[ref]) 
                        res.push(this.visitSeen(value))
                    else {
                        
                    }
                    
                } else
                    res.push(this.visitValue(value))
            }, this)
            
            if (res.length > 1)   return res
            if (res.length == 1)  return res[0]
            
            return undefined
        },
        
        
        visitSeen : function (value) {
            return this.seen[ value.__REF__ ]
        },
        
        
        visitNotSeen : function (value) {
            value.__VISITOR__ = []
            
        },
        
        
        visitArray  : function () {
        },
        
        
        visitObject : function (value) {
            if (Joose.O.isInstance(value))  return this.visitInstance(value)
            
            if (value instanceof array)     return this.visitArray(value)
            
            if (typeof value == 'function') return this.visitFunction(value)
            
            
            return this.visitGenericObject(value)
        },
        
        
        visitValue : function (value) {
            return value
        },
        
        
        visitGenericObject : function (value) {
            Joose.O.eachOwn(value, function (value, key) {
                
                
                
            }, this)
        },
        
        
        visitInstance : function (value) {
            return this.visitGenericObject(value)
        },
        
        
        visitObjectKey : function () {
        },
        
        
        visitObjectValue : function () {
        },
        
        
        visitFunction : function () {
        }
        
    },
 
    
body : function () {
    
    var ID      = 0
    
    this.meta.extend({
        my : {
            
            has : {
                hostClass   : null,
                
                tidy        : true
            },
            
            
            methods : {
                
                getID   : function () {
                    return ID++
                },
                
                
                visit : function () {
                    var visitor = new this.hostClass()
                    
                    visitor.visit.apply(visitor, arguments)
                }
            }
        }
    })

}})