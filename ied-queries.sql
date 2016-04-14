select distinct region from ied

select * from ied where LOCATION_LAT is null

select id,date,type,kia,wia,text from ied

select count(*) from ied
select distinct [type] from ied
select sum(kia),sum(wia),count(id) from ied
select distinct region from ied
select distinct country from ied

select region,sum(kia),sum(wia)
from ied
group by region
having sum(kia)>0 or sum(wia) >0


select [type],sum(kia),sum(wia),count(id)
from ied
group by [type]
having sum(kia)>0 or sum(wia) >0

update ied set region='KIEV' where region='¾KIEV'

update ied set country='UKRAINE' where country='UKRAINE¾'


--u pdate ied set map_xml=null where LOCATION_LAT is null

update ied set [type]=rtrim([type])



ZAPORIZHYE => ZAPOROZHYE 
MIKOLAYIV => MYKOLAIV
LUHANKS=> LUGANSK

