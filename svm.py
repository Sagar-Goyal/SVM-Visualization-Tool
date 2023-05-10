from sklearn import svm
import math

def train_svm(dataset):
    X=dataset['features']
    y=dataset['labels']
    C = dataset['c']

    clf = svm.SVC(kernel='linear', C=C)
    clf.fit(X,y)

    weights = clf.coef_[0]
    bias = clf.intercept_
    margin = math.sqrt(1/weights.dot(weights))
    error = 1-clf.score(X,y)

    weights = weights.tolist()
    bias = bias.tolist()
    margin = round(margin,7)
    error = round(error,7)

    return {'weights': weights, 'bias':bias, 'margin':margin,'error': error}