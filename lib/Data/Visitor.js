Class('Data.Visitor', {
    
    
    has : {
        seen                    : Joose.I.Object
    },
    
        
    methods : {
        
        visit : function () {
            var seen    = this.seen
            
            Joose.A.each(arguments, function (value) {
                
                if (value && typeof value == 'object' || typeof value == 'function') {
                    
                    var ref = value.__ID__
                    
                    if (!ref) ref = value.__ID__ = this.my.getRefAddr()
                    
                    if (seen[ref]) 
                        this.visitSeen(value)
                    else
                        this.visitNotSeenObject(value)
                    
                } else
                    this.visitValue(value)
                    
            }, this)
        },
        
        
        visitValue : function (value) {
        },
        
        
        visitSeen : function (value, result) {
        },
        
        
        // XXX also handle RegExp, Date
        visitNotSeenObject : function (value) {
            this.seen[ value.__ID__ ] = value
            
            if (Joose.O.isInstance(value))
                this.visitInstance(value)
            else
                if (value instanceof Array)
                    this.visitArray(value)
                else
                    if (typeof value == 'function')
                        this.visitFunction(value)
                    else
                        this.visitGenericObject(value)
        },
        
        
        visitArray  : function (array) {
            Joose.A.each(array, function (value, index) {
                
                this.visitArrayEntry(value, index, array)
                
            }, this)
        },
        
        
        visitArrayEntry  : function (value, index, array) {
            this.visit(value)
        },
        
        
        visitGenericObject : function (object) {
            Joose.O.eachOwn(object, function (value, key) {
                
                if (key != '__ID__') {
                    this.visitObjectKey(key, value, object)
                    this.visitObjectValue(value, key, object)
                }
                
            }, this)
        },
        
        
        visitInstance : function (value) {
            this.visitGenericObject(value)
        },
        
        
        visitObjectKey : function (key, value, object) {
            this.visitValue(key)
        },
        
        
        visitObjectValue : function (value, key, object) {
            this.visit(value)
        },
        
        
        visitFunction : function (value) {
            this.visitGenericObject(value)
        }
        
    },
 
    
body : function () {
    
    var ID      = 0
    
    this.meta.extend({
        my : {
            
            has : {
                HOST        : null
            },
            
            
            methods : {
                
                getRefAddr   : function () {
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