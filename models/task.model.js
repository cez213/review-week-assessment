var mongoose = require('mongoose')
var _ = require('lodash')
var Task;
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  // setup schema here
  parent: { type: Schema.Types.ObjectId, ref: 'Task'},
  name: { type: String, required: true },
  complete: { type: Boolean, required: true, default: false },
  due: Date
  
});

//virtuals

TaskSchema.virtual('timeRemaining').get(function() {
	if(!this.due) return Infinity;
	else return this.due - new Date();
})

TaskSchema.virtual('overdue').get(function() {
	return this.timeRemaining < 0 && !this.complete;
})

//methods

TaskSchema.methods.addChild = function(params) {
	params.parent = this._id;
 	return this.constructor.create(params);
 }

TaskSchema.methods.getChildren = function() {
	return this.constructor.find({parent: this._id}).exec();
}

TaskSchema.methods.getSiblings = function() {
	//return this.constructor.find({parent: this.parent}).where('_id').ne(this.id).exec();
	
	return this.constructor.find({
		_id: {
			$ne: this._id
		},
		parent: this.parent
	});

/*	self = this;
	return this.constructor.find({
		parent: this.parent
	}).exec().then(function(tasks){
		return _.reject(tasks, {_id: self._id})
	});*/

/*	self = this;
	return this.constructor.find({
		parent: this.parent
	}).exec().then(function(tasks){
		return tasks.filter(function(t){
			return t._id !== self._id;
		})
	});*/


}

Task = mongoose.model('Task', TaskSchema);


module.exports = Task;












