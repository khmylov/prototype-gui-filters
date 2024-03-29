var _ = require('underscore');
var FilterGroupModel = require('./filterGroupModel');

class FilterListModel {
    constructor(store, allFields, filterGroups) {
        this._store = store;
        this._allFields = allFields;
        this.filterGroups = _.map(filterGroups, f => this._createFilterGroupModel(f.fieldName, f.filters));
    }

    get compiledFilterText() {
        var result = _
            .chain(this.filterGroups)
            .map(f => f.compiledFilterText)
            .filter(_.identity)
            .value()
            .join(' and ');

        return result.length ? '?' + result : '';
    }

    get newFieldSuggestions() {
        return _
            .chain(this._allFields)
            .map(f => f.fieldName)
            .difference(_.map(this.filterGroups, f => f.fieldName))
            .sortBy(_.identity)
            .value();
    }

    addNewField(fieldName) {
        var newGroup = this._createFilterGroupModel(fieldName, []);
        this.filterGroups.push(newGroup);
        this._store.notifyFiltersChanged();

        return newGroup;
    }

    removeField(filterGroup) {
        this.filterGroups = _.without(this.filterGroups, filterGroup);
        this._store.notifyFiltersChanged();
    }

    _createFilterGroupModel(fieldName, filters) {
        var field = _.findWhere(this._allFields, {fieldName: fieldName});
        return new FilterGroupModel(this._store, field, filters);
    }
}

module.exports = FilterListModel;
