import numpy as np;
import pandas as pd;
from sklearn.feature_extraction.text import CountVectorizer;
from sklearn.feature_extraction.text import TfidfTransformer;
from sklearn.metrics.pairwise import cosine_similarity;
import json;
import csv;

# Load the IED data from csv
df = pd.read_csv('ied_data.csv',encoding='ISO-8859-1');
print(df.columns.values);
corpus = list(df["text"]);
ids = list(df["id"]);
types = list(df["type"]);
print(types[0])

# Vectorize the IED Text using 1-grams (individual words)
vectorizer = CountVectorizer(min_df=1)

# Information Retrieval using Bag of Words model
bag_of_words = vectorizer.fit_transform(corpus);
bow_features = vectorizer.get_feature_names();
print("Bag of Words: ",len(bow_features),bow_features);

# Find the Term Frequency Counts:
tf_counts = bag_of_words.toarray();
print(tf_counts);

# Tf–idf term weighting
transformer = TfidfTransformer();
tfidf_matrix = transformer.fit_transform(tf_counts);
print("TF-IDF Matrix:",tfidf_matrix.shape);
tfidf_array = tfidf_matrix.toarray();

max_top_words =3;

# print(tfidf_array[0]);
# print(tfidf_array[0].argsort()[-3:][::-1]);
node_top_words = tfidf_array[0].argsort()[-max_top_words:][::-1];
for c in range(0,max_top_words):
    print(str(ids[0]),node_top_words[c],tfidf_array[0][node_top_words[c]],bow_features[node_top_words[c]]);

# for c in range(0,1390):
#     print(tfidf_array[0][c]);

node_top_words = [];

# Write to CSV
with open('topwords.csv', 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile, delimiter=',',quotechar='|', quoting=csv.QUOTE_MINIMAL)
    csvwriter.writerow(['id', 'word_1', 'w1_value', 'word_2', 'w2_value', 'word_3', 'w3_value']);

    # For every document - row in the tfidf matrix
    for r in range(0, tfidf_matrix.shape[0]):
        node_top_words = tfidf_array[r].argsort()[-max_top_words:][::-1];
        csvwriter.writerow([str(ids[r]),bow_features[node_top_words[0]],tfidf_array[r][node_top_words[0]],bow_features[node_top_words[1]],tfidf_array[r][node_top_words[1]],bow_features[node_top_words[2]],tfidf_array[r][node_top_words[2]]]);
