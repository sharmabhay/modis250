# setRepositories()
# install.packages("caTools")
# install.packages("randomForest")
gc()
memory.limit(size=100000)

library(caTools)
library(randomForest)

df <- read.csv("C:/Users/abhay_sharma/Desktop/NRCan/unsatDFFAPAR1.csv")
# df2 <- read.csv("C:/Users/abhay_sharma/Desktop/NRCan/unsatDFLC1.csv"

sample <- sample.split(df$LAI, SplitRatio=0.7)
sample

train <- subset(df, sample==TRUE)
test <- subset(df, sample==FALSE)

dim(train)
dim(test)

head(train$LAI)

train_x <- train[, c(2,3,4,5,6,7)]
test_x <- test[, c(2,3,4,5,6,7)]

dim(train_x)
head(train_x)
summary(train_x)
sapply(train_x, class)

# Equivalent code:
# classifier_RF <- randomForest(train$LAI ~ .,
#                              data=train_x,
#                              nodesize=5,
#                              ntree=2)
classifier_RF <- randomForest(x=train_x,
                              y=train$LAI,
                              importance=TRUE,
                              nodesize=5,
                              ntree=2)
classifier_RF
