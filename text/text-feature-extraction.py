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
df_nodes = pd.DataFrame(columns=('node', 'group','name','type'));
df_links = pd.DataFrame(columns=('source', 'target','value','source_type'));
node_word = "";


# For every document - row in the tfidf matrix
for r in range(0, tfidf_matrix.shape[0]):
    node_word = "";

    # Find Cosine Similarity for each row/document
    cs = cosine_similarity(tfidf_matrix[r:r+1], tfidf_matrix);

    # For each document check if the current document "r" is similar to "c"
    for c in range(0, cs.shape[1]):
        if (r != c) and (cs[0,c] >= cs_threshold):
            if any(df_links["source"] == ids[c]) and any(df_links["target"] == ids[r]):
                x =0;
            else:
                total_links = total_links+1;
                df_links.loc[len(df_links)] = {"source":ids[r],"target":ids[c],"value":round(cs[0,c],2),"source_type":str(types[r])};
                #links.append({"source":r,"target":c,"value":round(cs[0,c],2),"source_type":str(types[r])});

                # Nodes
                if any(df_nodes["node"] == ids[c]):
                    x=0;
                else:
                    df_nodes.loc[len(df_nodes)] = {"node":ids[c],"group":ids[r],"name":str(corpus[c]),"type":str(types[c])};

                # Nodes
                if any(df_nodes["node"] == ids[r]):
                    x=0;
                else:
                    df_nodes.loc[len(df_nodes)] = {"node":ids[r],"group":ids[r],"name":str(corpus[r]),"type":str(types[r])};

                #test = df_links[df_links.source.isin([ids[r],ids[c]])];
                #print(test);

    # To get the max weighted word in a document
    #amax = np.amax(tfidf_array[r]);
    #node_word = "";
    #if amax > 0:
    #    argmax = np.argmax(tfidf_array[r]);
    #    node_word = bow_features[argmax];

    # Get top 3 words from a document
    top_words = tfidf_array[r].argsort()[-3:][::-1];

    #nodes.append({"name":str(corpus[r]),"id":str(ids[r]),"type":str(types[r]),"word":node_word});

#print(df_nodes.values);
#node_array = [];
#for index, row in df_nodes.iterrows():
    #node_array.append(row['node']);
    #nodes.append({"name":row['name'],"id":row['node'],"type":row['type'],"word":"","group":row['group']});

#for index, row in df_links.iterrows():
#    links.append({"source":node_array.index(row["source"]),"target":node_array.index(row["target"]),"value":row['value'],"source_type":row['source_type']});


# Cluster all related Nodes
found = False;
gnum = 1;
grouplist = [0];
df_cluster_nodes = pd.DataFrame(columns=('node', 'group','name','type'));

def process_nodes(related_nodes):
    gnum = 0;
    for index, row in related_nodes.iterrows():
        find = df_cluster_nodes[df_cluster_nodes.node.isin([row['source'],row["target"]])];
        if find.shape[0] > 0:
            gnum = find.loc[find.index[0], 'group'];

    if gnum ==0:
        gnum = max(grouplist)+1;
        grouplist.append(gnum);

    for index, row in related_nodes.iterrows():
        find = df_cluster_nodes[df_cluster_nodes.node.isin([row['source']])];
        if find.shape[0] == 0:
            node_details = df_nodes[df_nodes.node.isin([row['source']])];
            df_cluster_nodes.loc[len(df_cluster_nodes)] = {"node":row['source'],"group":gnum,"name":node_details.loc[node_details.index[0], 'name'],"type":node_details.loc[node_details.index[0], 'type']};

        find = df_cluster_nodes[df_cluster_nodes.node.isin([row['target']])];
        if find.shape[0] == 0:
            node_details = df_nodes[df_nodes.node.isin([row['target']])];
            df_cluster_nodes.loc[len(df_cluster_nodes)] = {"node":row['target'],"group":gnum,"name":node_details.loc[node_details.index[0], 'name'],"type":node_details.loc[node_details.index[0], 'type']};


for index, row in df_links.iterrows():
    # Find all related nodes for source
    related_nodes = df_links[df_links.source.isin([row['source']])];
    related_nodes.append(df_links[df_links.target.isin([row['source']])]);
    related_nodes.append(df_links[df_links.source.isin([row['target']])]);
    related_nodes.append(df_links[df_links.target.isin([row['target']])]);
    process_nodes(related_nodes);

node_array = [];
for index, row in df_cluster_nodes.iterrows():
    node_array.append(row['node']);
    nodes.append({"name":row['name'],"id":row['node'],"type":row['type'],"word":"","group":row['group']});

for index, row in df_links.iterrows():
    links.append({"source":node_array.index(row["source"]),"target":node_array.index(row["target"]),"value":row['value'],"source_type":row['source_type']});


print("Cluster Nodes: ",df_cluster_nodes);
print("Groups: ",grouplist);

print("Links Count: ",total_links);

# Build json of nodes and links
return_json = {};
return_json["nodes"] = nodes;
return_json["links"] = links;
with open('text-features.json','w') as outfile:
    json.dump(return_json,outfile);
