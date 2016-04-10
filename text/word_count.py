import numpy as np;
import pandas as pd;
from sklearn.feature_extraction.text import CountVectorizer;
from sklearn.feature_extraction.text import TfidfTransformer;
from sklearn.metrics.pairwise import cosine_similarity;
import json;

# Load the IED data from csv
df = pd.read_csv('ied_text.csv',encoding='ISO-8859-1');
print(df.columns.values);