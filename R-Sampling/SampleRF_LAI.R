# setRepositories()
# install.packages("caTools")
# install.packages("randomForest")
gc()
memory.limit(size=150000)
options(max.print=10000000)

library(caTools)
library(randomForest)
library(reprtree)
library(MASS)

num_files <- length(list.files("C:/Users/abhay_sharma/Desktop/NRCan/data/unsatDFLAILC"))
for (i in 1:num_files) {
  file_csv <- file.path("C:/Users/abhay_sharma/Desktop/NRCan/data/unsatDFLAILC/", paste0("unsatDFLAILC", i, ".csv"))

  if (file.exists(file_csv)) {
    df <- read.csv(file_csv)
    df_unique <- unique(df)
    df_sample <- head(df_unique, 100000)
    names(df_sample) <- c("LAI", "b01", "b02", "vza", "vaa", "sza", "saa")
    cat(paste0("Dimensions of unsatDFLAILC", i, ":"), dim(df_unique))

    sample <- sample.split(df_sample$LAI, SplitRatio=0.7)
    train <- subset(df_sample, sample==TRUE)
    test <- subset(df_sample, sample==FALSE)

    train_x <- train[, c(2,3,4,5,6,7)]
    test_x <- test[, c(2,3,4,5,6,7)]

    # dim(train)
    # dim(test)
    # head(train$LAI)
    # dim(train_x)
    # head(train_x)
    # summary(train_x)
    # sapply(train_x, class)

    regression_RF <- randomForest(train$LAI ~ .,
                                  data=train_x,
                                  importance=TRUE,
                                  maxnodes=10000,
                                  mtry=6,
                                  do.trace=100,
                                  nodesize=5,
                                  ntree=10)
    print(regression_RF)
    print(head(train_x))

    files <- file.path("C:/Users/abhay_sharma/Desktop/trees/unsatDFLAILC", paste0("unsatDFLAILC", i))
    for (x in 1:regression_RF$ntree) {
      sink(file.path(files, paste0("tree0", x, ".txt")))

      tree <- getTree(regression_RF, k=x, labelVar=TRUE)
      realTree <- reprtree:::as.tree(tree, regression_RF)
      print(realTree)

      sink()
    }

    pred_train <- predict(regression_RF, newdata=train_x)
    k_train <- kde2d(pred_train, train$LAI, n=200)
    image(k_train, main=paste0("Fit Comparison for unsatDFLAILC", i), xlab="Predicted Train Values", ylab="Actual Values", col=hcl.colors(12, "YlOrRd", rev=TRUE))

    pred_test <- predict(regression_RF, newdata=test_x)
    k_test <- kde2d(pred_test, test$LAI, n=200)
    image(k_test, main=paste0("Fit Comparison for unsatDFLAILC", i), xlab="Predicted Test Values", ylab="Actual Values", col=hcl.colors(12, "YlOrRd", rev=TRUE))
  }
  else {
    next
  }
}
