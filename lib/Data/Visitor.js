Class('Data.Visitor', {
    
    has : {
        seen                    : Joose.I.Object
    },
    
        
    methods : {
        
        getClassNameFor : function (object) {
            if (Joose.O.isInstance(object))      return object.meta.name
            
            return Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/\]$/, '')
        },
        
        
        visit : function () {
            var seen    = this.seen
            
            var res = Joose.A.map(arguments, function (value) {
                
                if (value && typeof value == 'object' || typeof value == 'function') {
                    
                    var ref         = value.__REFADR__
                    
                    if (ref != null && seen[ ref ]) 
                        return this.visitSeen(value, seen[ ref ])
                    else                        
                        return this.visitNotSeen(value)
                    
                } else
                    return this.visitValue(value)
                    
            }, this)
            
            return res.length > 1 ? res : res[0]
        },
        
        
        visitValue : function (value) {
            return value
        },
        
        
        visitSeen : function (value, seenResult) {
            return seenResult
        },
        
        
        markSeen    : function (object) {
            this.seen[ object.__REFADR__ ] = object
        },
        
        
        assignRefAdrTo : function (object) {
            if (!object.__REFADR__) object.__REFADR__ = this.getRefAdrFor(object)
        },
        
        
        visitNotSeen : function (object) {
            var className   = this.getClassNameFor(object)
            
            this.assignRefAdrTo(object)
            
            var REFADR  = object.__REFADR__
            
            this.markSeen(object)

            
            if (Joose.O.isInstance(object)) return this.seen[ REFADR ] = this.visitJooseInstance(object, className)
            
            
            var methodName = 'visit' + className
            
            if (!this.meta.hasMethod(methodName)) methodName = 'visitObject' 
            
            return this.seen[ REFADR ] = this[ methodName ](object, className)
        },
        
        
        visitArray  : function (array, className) {
            Joose.A.each(array, function (value, index) {
                
                this.visitArrayEntry(value, index, array)
                
            }, this)
            
            return array
        },
        
        
        visitArrayEntry  : function (value, index, array) {
            return this.visit(value)
        },
        
        
        visitObject : function (object, className) {
            Joose.O.eachOwn(object, function (value, key) {
                
                if (key != '__REFADR__') {
                    this.visitObjectKey(key, value, object)
                    this.visitObjectValue(value, key, object)
                }
                
            }, this)
            
            return object
        },
        
        
        visitJooseInstance : function (value, className) {
            return this.visitObject(value, className)
        },
        
        
        visitObjectKey : function (key, value, object) {
            return this.visitValue(key)
        },
        
        
        visitObjectValue : function (value, key, object) {
            return this.visit(value)
        }
        
    },
 
    
body : function () {
    
    var REF      = 1
    
    this.meta.extend({
        
        methods : {
            
            getRefAdrFor   : function (object) {
                return REF++
            }
        },
                
                
        my : {
            
            has : {
                HOST        : null
            },
            
            
            methods : {
                
                visit : function () {
                    var visitor     = new this.HOST()
                    
                    return visitor.visit.apply(visitor, arguments)
                }
            }
        }
    })

}})