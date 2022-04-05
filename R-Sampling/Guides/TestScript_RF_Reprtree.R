library(devtools) # includes randomForest
library(caTools)
library(reprtree)

fit <- randomForest(mpg ~ ., data=mtcars, importance=TRUE, proximity=TRUE)

tree <- getTree(fit, k=1, labelVar=TRUE)
tree

realtree <- reprtree:::as.tree(tree, fit)
realtree


model <- randomForest(Species ~ ., data=iris, importance=TRUE, ntree=500, mtry = 2, do.trace=100)

tree1 <- getTree(model, k=1, labelVar=TRUE)
tree1

realTree <- reprtree:::as.tree(tree1, model)
realTree
