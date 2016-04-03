import numpy as np;
import pandas as pd;
from sklearn.feature_extraction.text import CountVectorizer;
from sklearn.feature_extraction.text import TfidfTransformer;
from sklearn.metrics.pairwise import cosine_similarity;
import json;


# Load the IED data from csv
df = pd.read_csv('ied.csv',encoding='ISO-8859-1');
print(df.columns.values);
corpus = list(df["TEXT"]);
ids = list(df["ID"]);
types = list(df["TYPE"]);
print(types[0])

# Vectorize the IED Text using 1-grams (individual words)
vectorizer = CountVectorizer(min_df=1)

# Information Retrieval using Bag of Words model
bag_of_words = vectorizer.fit_transform(corpus);
bow_features = vectorizer.get_feature_names();
print("Bag of Words: ",len(bow_features));

# Find the Term Frequency Counts:
tf_counts = bag_of_words.toarray();
print(tf_counts);

# Tf–idf term weighting
transformer = TfidfTransformer();
tfidf_matrix = transformer.fit_transform(tf_counts);
print("TF-IDF Matrix:",tfidf_matrix.shape);
tfidf_array = tfidf_matrix.toarray();

# Arrays to store the nodes and links
nodes = [];
links = [];
# Thresholds
cs_threshold = 0.45;

total_links =0;
df_links = pd.DataFrame(columns=('source', 'target'))
node_word = "";

# For every document - row in the tfidf matrix
for r in range(0, tfidf_matrix.shape[0]):
    node_word = "";

    # Find Cosine Similarity for each row/document
    cs = cosine_similarity(tfidf_matrix[r:r+1], tfidf_matrix);

    for c in range(0, cs.shape[1]):
        if (r != c) and (cs[0,c] >= cs_threshold):
            if any(df_links["source"] == c) and any(df_links["target"] == r):
                x =0;
            else:
                total_links = total_links+1;
                df_links.loc[len(df_links)] = {"source":r,"target":c};
                links.append({"source":r,"target":c,"value":round(cs[0,c],2),"source_type":str(types[r])});

    amax = np.amax(tfidf_array[r]);
    node_word = "";
    if amax > 0:
        argmax = np.argmax(tfidf_array[r]);
        node_word = bow_features[argmax];
    nodes.append({"name":str(corpus[r]),"id":str(ids[r]),"type":str(types[r]),"word":node_word});

print("Links Count: ",total_links);

# Build json of nodes and links
return_json = {};
return_json["nodes"] = nodes;
return_json["links"] = links;
with open('text-features.json','w') as outfile:
    json.dump(return_json,outfile);
