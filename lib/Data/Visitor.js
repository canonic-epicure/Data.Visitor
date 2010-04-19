Class('Data.Visitor', {
    
    
    has : {
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
                    else
                        res.push(this.visitNotSeen(value))
                    
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
            return this.seen[ value.__REF__ ] = this.visitObject(value)
        },
        
        
        visitArray  : function (array) {
            Joose.A.each(array, function (value, index) {
                
                this.visitArrayEntry(value, index, array)
                
            }, this)
            
            return array
        },
        
        
        visitArrayEntry  : function (value, index, array) {
            return this.visit(value)
        },
        
        
        visitObject : function (value) {
            if (Joose.O.isInstance(value))  return this.visitInstance(value)
            
            if (value instanceof Array)     return this.visitArray(value)
            
            if (typeof value == 'function') return this.visitFunction(value)
            
            
            return this.visitGenericObject(value)
        },
        
        
        visitValue : function (value) {
            return value
        },
        
        
        visitGenericObject : function (object) {
            Joose.O.eachOwn(object, function (value, key) {
                
                if (key != '__REF__') {
                    this.visitObjectKey(key, value, object)
                    this.visitObjectValue(value, key, object)
                }
                
            }, this)
            
            return object
        },
        
        
        visitInstance : function (value) {
            return this.visitGenericObject(value)
        },
        
        
        visitObjectKey : function (key, value, object) {
            return this.visitValue(key)
        },
        
        
        visitObjectValue : function (value, key, object) {
            return this.visit(value)
        },
        
        
        visitFunction : function (value) {
            return this.visitValue(value)
        }
        
    },
 
    
body : function () {
    
    var ID      = 0
    
    this.meta.extend({
        my : {
            
            has : {
                HOST        : null,
                
                tidy        : true
            },
            
            
            methods : {
                
                getID   : function () {
                    return ID++
                },
                
                
                visit : function () {
                    var visitor = new this.HOST()
                    
                    return visitor.visit.apply(visitor, arguments)
                }
            }
        }
    })

}})