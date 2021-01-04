import dydu from './dydu';

const OPERATOR = {
    Contains: 'Contains',
    DoesNotStartWith: 'DoesNotStartWith',
    Equals: 'Equals',
    GreaterThan: 'GreaterThan',
    IsContained: 'IsContained',
    LesserThan: 'LesserThan',
    NotEquals: 'NotEquals',
    StartsWith: 'StartsWith',
};

function isValidStringOperator(operator) {
    return operator === OPERATOR.Equals
        || operator === OPERATOR.NotEquals
        || operator === OPERATOR.StartsWith
        || operator === OPERATOR.DoesNotStartWith
        || operator === OPERATOR.IsContained
        || operator === OPERATOR.Contains;
}

function isValidNumericOperator(operator) {
    return operator === OPERATOR.Equals
        || operator === OPERATOR.NotEquals
        || operator === OPERATOR.GreaterThan
        || operator === OPERATOR.LesserThan;
}

export function fetchPushrules() {
    dydu.pushrules().then(data => {
        if (data) {
            const pushrules = JSON.parse('[' + data);
            console.log(pushrules)

            if (Array.isArray(pushrules)) {
                pushrules.map(rule => {
                    checkRuleConditions(rule.conditions);
                });
            }
        }
    });
}

function checkRuleConditions(conditions) {
    conditions.map(condition => {
        console.log(condition);
    });
}


function PageVisitDuration (condition) {
    
}

function CurrentPage (condition) {

}

