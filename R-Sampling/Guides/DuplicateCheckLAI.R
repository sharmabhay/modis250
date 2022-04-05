# setRepositories()
# install.packages("caTools")
# install.packages("randomForest")
gc()
memory.limit(size=100000)
options(max.print=10000000)

library(caTools)
library(randomForest)
library(reprtree)

end <- length(list.files("C:/Users/abhay_sharma/Desktop/NRCan/data/unsatDFLAILC"))
for (i in 1:end) {
  file_csv <- file.path("C:/Users/abhay_sharma/Desktop/NRCan/data/unsatDFLAILC/", paste0("unsatDFLAILC", i, ".csv"))

  if (file.exists(file_csv)) {
    df <- read.csv(file_csv)
    names(df) <- c("LAI", "b01", "b02", "vza", "vaa", "sza", "saa")

    hist(df$b01)
    hist(df$b02)
    hist(df$vza)
    hist(df$vaa)
    hist(df$sza)
    hist(df$saa)
    hist(df$LAI)
  }
  else {
    next
  }
}
