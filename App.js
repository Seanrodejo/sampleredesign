import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ImageBackground,
  Platform,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ChevronLeft, 
  Compass, 
  Wand2, 
  Sparkles, 
  Flame, 
  ChevronRight, 
  Play, 
  Heart, 
  Repeat,
  LayoutGrid,
  Plus,
  CloudDownload,
  User
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CategoryItems = [
  { id: 1, name: 'Discover', icon: Compass },
  { id: 2, name: 'Create', icon: Wand2 },
  { id: 3, name: 'New', icon: Sparkles },
  { id: 4, name: 'Trending', icon: Flame },
];

const ShootsData = [
  { id: 'p1', label: 'Richman', uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400' },
  { id: 'p2', label: 'Fitness Guy', uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400' },
  { id: 'p3', label: 'Business Boy', uri: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400' },
  { id: 'p4', label: 'Urban Mode', uri: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=400' },
  { id: 'p5', label: 'Classic Man', uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400' },
  { id: 'p6', label: 'Street Style', uri: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=400' },
];

const GlobalFeed = [
  { id: 'c1', title: 'the camera slowly turns', likes: 1200, shares: '124', uri: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400' },
  { id: 'c2', title: 'cinematic portrait', likes: 890, shares: '56', uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400' },
  { id: 'c3', title: 'urban lights v2', likes: 4400, shares: '312', uri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400' },
  { id: 'c4', title: 'night aesthetic', likes: 102, shares: '45', uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400' },
  { id: 'c5', title: 'nature walk', likes: 67, shares: '23', uri: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=400' },
];

const formatMetric = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const ShineOverlay = ({ animValue, width = 300 }) => {
  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width * 1.5],
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.0)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, width: width / 2 }}
      />
    </Animated.View>
  );
};

const DraggableScroll = ({ children, horizontal, style, contentContainerStyle, onScroll, scrollEventThrottle }) => {
  const scrollRef = useRef(null);

  const handleMouseDown = (e) => {
    if (Platform.OS !== 'web' || !scrollRef.current) return;
    const node = scrollRef.current.getScrollableNode();
    node.isDown = true;
    node.startPos = horizontal ? e.nativeEvent.pageX : e.nativeEvent.pageY;
    node.scrollInit = horizontal ? node.scrollLeft : node.scrollTop;
  };

  const handleMouseUpOrLeave = () => {
    if (Platform.OS !== 'web' || !scrollRef.current) return;
    scrollRef.current.getScrollableNode().isDown = false;
  };

  const handleMouseMove = (e) => {
    if (Platform.OS !== 'web' || !scrollRef.current) return;
    const node = scrollRef.current.getScrollableNode();
    if (!node.isDown) return;
    if (horizontal) {
      const walk = (e.nativeEvent.pageX - node.startPos) * 1.5;
      node.scrollLeft = node.scrollInit - walk;
    } else {
      const walk = (e.nativeEvent.pageY - node.startPos) * 1.5;
      node.scrollTop = node.scrollInit - walk;
    }
  };

  return (
    <View 
      style={style}
      {...(Platform.OS === 'web' ? {
        onMouseDown: handleMouseDown,
        onMouseLeave: handleMouseUpOrLeave,
        onMouseUp: handleMouseUpOrLeave,
        onMouseMove: handleMouseMove,
      } : {})}
    >
      <ScrollView
        ref={scrollRef}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        style={Platform.OS === 'web' ? { cursor: horizontal ? 'grab' : 'default' } : {}}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const AnimatedInteractiveButton = ({ children, style, onPress, activeOpacity = 0.85 }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 1.05, tension: 300, friction: 10, useNativeDriver: true }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, tension: 300, friction: 10, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity 
        activeOpacity={activeOpacity} 
        onPress={onPress} 
        onPressIn={handlePressIn} 
        onPressOut={handlePressOut}
        style={[styles.hoverPointer, { flex: 1 }]}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const DynamicDockItem = ({ item, isActive, onPress, isSpecial = false }) => {
  const animVal = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const plusRotate = useRef(new Animated.Value(0)).current;
  const plusScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(animVal, {
      toValue: isActive ? 1 : 0,
      tension: 200,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  const handlePlusPress = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(plusRotate, { toValue: 1, tension: 250, friction: 10, useNativeDriver: true }),
        Animated.spring(plusScale, { toValue: 1.15, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.spring(plusRotate, { toValue: 0, tension: 250, friction: 10, useNativeDriver: true }),
        Animated.spring(plusScale, { toValue: 1, useNativeDriver: true })
      ])
    ]).start();
    if (onPress) onPress();
  };

  const translateY = animVal.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const scale = animVal.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
  const rotation = plusRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] });

  return (
    <TouchableOpacity activeOpacity={1} onPress={isSpecial ? handlePlusPress : onPress} style={styles.dockItem}>
      <Animated.View style={[{ transform: [{ translateY: isSpecial ? 0 : translateY }, { scale: isSpecial ? plusScale : scale }, { rotate: isSpecial ? rotation : '0deg' }] }, styles.dockIconCenter]}>
        {isSpecial ? (
            <LinearGradient colors={['#0ea5e9', '#2563eb']} style={styles.plusContainer}>
                <Plus color="#fff" size={24} strokeWidth={3} />
            </LinearGradient>
        ) : (
            <item.icon color={isActive ? "#0ea5e9" : "#94a3b8"} size={22} strokeWidth={isActive ? 2.5 : 2} />
        )}
        {isActive && !isSpecial && <View style={styles.dockActiveDot} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function MobileAppContainer() {
  const [activeTab, setActiveTab] = useState(1);
  const [activeDock, setActiveDock] = useState('home');
  const [selectedShoot, setSelectedShoot] = useState('p1');
  const [likedFeeds, setLikedFeeds] = useState([]);

  const scrollX = useRef(new Animated.Value(0)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const smoothEase = Easing.bezier(0.4, 0, 0.2, 1);
    const createFloat = (animValue, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, { toValue: 1, duration, easing: smoothEase, useNativeDriver: true }),
          Animated.timing(animValue, { toValue: 0, duration, easing: smoothEase, useNativeDriver: true })
        ])
      );
    };
    const createShine = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shineAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.linear), useNativeDriver: true }),
          Animated.delay(3500),
          Animated.timing(shineAnim, { toValue: 0, duration: 0, useNativeDriver: true })
        ])
      ).start();
    };
    createFloat(floatAnim1, 12000).start();
    createFloat(floatAnim2, 18000).start();
    createShine();
  }, []);

  const translateY1 = floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -80] });
  const translateY2 = floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 120] });
  const translateX2 = floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });

  const toggleLike = (id) => {
    setLikedFeeds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <View style={styles.webWrapper}>
      <View style={styles.phoneFrame}>
        <SafeAreaView style={styles.appContainer}>
          <StatusBar barStyle="light-content" />
          
          <View style={styles.absoluteLayer}>
            <View style={styles.deepBackground} />
            <Animated.View style={[styles.auroraOrb, styles.orbBlue, { transform: [{ translateY: translateY1 }] }]} />
            <Animated.View style={[styles.auroraOrb, styles.orbCyan, { transform: [{ translateY: translateY2 }, { translateX: translateX2 }] }]} />
            <BlurView intensity={90} tint="dark" style={styles.absoluteLayer} />
          </View>

          <DraggableScroll horizontal={false} style={styles.mainDragScroll} contentContainerStyle={{ paddingBottom: 110 }}>
            
            <View style={styles.topAction}>
              <AnimatedInteractiveButton style={styles.backBtnWrapper}>
                <BlurView intensity={20} tint="light" style={styles.glassCircle}>
                  <ChevronLeft color="#fff" size={24} strokeWidth={2.5} />
                </BlurView>
              </AnimatedInteractiveButton>
            </View>

            <DraggableScroll horizontal={true} style={styles.navigationTabs} contentContainerStyle={styles.dragScrollContentTabs}>
              {CategoryItems.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <AnimatedInteractiveButton 
                    key={tab.id} 
                    style={styles.pillWrapper}
                    onPress={() => setActiveTab(tab.id)}
                  >
                    <View style={[styles.pillGlass, isActive && styles.pillActive]}>
                      {isActive && <ShineOverlay animValue={shineAnim} width={150} />}
                      <tab.icon size={16} color={isActive ? "#0f172a" : "#cbd5e1"} strokeWidth={isActive ? 3 : 2.5} />
                      <Text style={[styles.label, isActive && styles.labelActive]}>{tab.name}</Text>
                    </View>
                  </AnimatedInteractiveButton>
                );
              })}
            </DraggableScroll>

            <View style={styles.bannerWrapper}>
              <AnimatedInteractiveButton activeOpacity={0.9}>
                <View style={styles.heroContainer}>
                  <ImageBackground source={require('./assets/Micromagic.jpg')} style={styles.heroBox}>
                    <ShineOverlay animValue={shineAnim} width={400} />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(2,6,23,0.95)']} style={styles.heroShade}>
                      <View style={{flex: 1}}>
                        <View style={styles.newBadge}>
                          <Sparkles color="#fff" size={10} strokeWidth={3} />
                          <Text style={styles.newBadgeText}>FEATURED</Text>
                        </View>
                        <Text style={styles.heroTextMain}>Micro Magic</Text>
                        <Text style={styles.heroTextSub}>Tiny crew stars your product.</Text>
                      </View>
                      <View style={styles.btnTryContainer}>
                        <View style={styles.btnSolidWhite}>
                          <Text style={styles.btnLabel}>Try Now</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              </AnimatedInteractiveButton>
            </View>

            <View style={styles.headerTitleRow}>
              <Text style={styles.titleMain}>AI Photoshoots</Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight color="#0ea5e9" size={14} strokeWidth={3} />
              </TouchableOpacity>
            </View>

            <View style={styles.scrollWrapper}>
              <DraggableScroll horizontal={true} contentContainerStyle={styles.dragScrollContentCards}>
                {ShootsData.map((item) => {
                  const isSelected = selectedShoot === item.id;
                  return (
                    <AnimatedInteractiveButton 
                      key={item.id} 
                      style={[styles.cardCommon, isSelected && styles.cardActive]}
                      onPress={() => setSelectedShoot(item.id)}
                    >
                      <View style={[styles.cardInner, isSelected && styles.cardInnerActive]}>
                        <Image source={{ uri: item.uri }} style={styles.mediaCover} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cardOverlay} />
                        
                        <LinearGradient 
                          colors={['#FDE68A', '#F59E0B', '#B45309']} 
                          start={{x:0, y:0}} 
                          end={{x:1, y:1}} 
                          style={styles.proTagGold}
                        >
                          <Text style={styles.proTextGold}>PRO</Text>
                        </LinearGradient>

                        <View style={styles.userBadge}>
                          <Image source={{ uri: `https://i.pravatar.cc/100?u=${item.id}` }} style={styles.userAvatar} />
                        </View>
                        <Text style={styles.cardLabel}>{item.label}</Text>
                      </View>
                    </AnimatedInteractiveButton>
                  );
                })}
              </DraggableScroll>
            </View>

            <View style={[styles.headerTitleRow, { marginTop: 12 }]}>
              <Text style={styles.titleMain}>Community</Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight color="#0ea5e9" size={14} strokeWidth={3} />
              </TouchableOpacity>
            </View>

            <View style={styles.scrollWrapper}>
              <DraggableScroll horizontal={true} contentContainerStyle={styles.dragScrollContentCards}>
                {GlobalFeed.map((item) => {
                  const isLiked = likedFeeds.includes(item.id);
                  return (
                    <AnimatedInteractiveButton 
                      key={item.id} 
                      style={styles.cardCommon}
                      onPress={() => toggleLike(item.id)}
                    >
                      <View style={styles.cardInner}>
                        <Image source={{ uri: item.uri }} style={styles.mediaCover} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.cardOverlay} />
                        <View style={styles.playCenter}>
                          <BlurView intensity={90} tint="light" style={styles.playButton}>
                            <Play size={14} color="#0ea5e9" fill="#0ea5e9" style={{ marginLeft: 3 }} />
                          </BlurView>
                        </View>
                        <View style={styles.feedInfo}>
                          <Text style={styles.feedTitle} numberOfLines={1}>{item.title}</Text>
                          <View style={styles.metricRow}>
                            <View style={styles.metricItem}>
                              <Heart size={14} color={isLiked ? "#ef4444" : "#fff"} fill={isLiked ? "#ef4444" : "transparent"} strokeWidth={2} />
                              <Text style={[styles.metricText, isLiked && {color: '#ef4444'}]}>{formatMetric(isLiked ? item.likes + 1 : item.likes)}</Text>
                            </View>
                            <View style={styles.metricItem}>
                              <Repeat size={14} color="#fff" strokeWidth={2} />
                              <Text style={styles.metricText}>{item.shares}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </AnimatedInteractiveButton>
                  );
                })}
              </DraggableScroll>
            </View>
          </DraggableScroll>

          <View style={styles.dockWrapper} pointerEvents="box-none">
            <BlurView intensity={95} tint="dark" style={styles.dockIsland}>
                <DynamicDockItem item={{icon: LayoutGrid}} isActive={activeDock === 'home'} onPress={() => setActiveDock('home')} />
                <DynamicDockItem item={{icon: Compass}} isActive={activeDock === 'explore'} onPress={() => setActiveDock('explore')} />
                <DynamicDockItem isSpecial={true} onPress={() => console.log('Action')} />
                <DynamicDockItem item={{icon: CloudDownload}} isActive={activeDock === 'dl'} onPress={() => setActiveDock('dl')} />
                <DynamicDockItem item={{icon: User}} isActive={activeDock === 'user'} onPress={() => setActiveDock('user')} />
            </BlurView>
          </View>

        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  phoneFrame: { 
    width: Platform.OS === 'web' ? 360 : '100%', 
    height: Platform.OS === 'web' ? 720 : '100%',
    backgroundColor: '#0f172a', 
    borderRadius: Platform.OS === 'web' ? 45 : 0, 
    overflow: 'hidden', 
    borderWidth: Platform.OS === 'web' ? 10 : 0, 
    borderColor: '#1e293b'
  },
  appContainer: { flex: 1, backgroundColor: 'transparent' },
  absoluteLayer: { ...StyleSheet.absoluteFillObject },
  deepBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: '#020617' },
  auroraOrb: { position: 'absolute', width: 450, height: 450, borderRadius: 225, opacity: 0.45 },
  orbBlue: { top: -150, right: -150, backgroundColor: '#0ea5e9' },
  orbCyan: { bottom: 50, left: -150, backgroundColor: '#22d3ee' },
  mainDragScroll: { flex: 1 },
  scrollWrapper: { height: 175 },
  dragScrollContentTabs: { paddingHorizontal: 16, alignItems: 'center' },
  dragScrollContentCards: { paddingHorizontal: 16, alignItems: 'center' },
  hoverPointer: { ...Platform.select({ web: { cursor: 'pointer' } }) },
  topAction: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 5 },
  backBtnWrapper: { width: 40, height: 40 },
  glassCircle: { flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  navigationTabs: { marginBottom: 12 },
  pillWrapper: { marginRight: 8 },
  pillGlass: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  pillActive: { backgroundColor: '#fff' },
  label: { color: '#e2e8f0', marginLeft: 6, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  labelActive: { color: '#0f172a', fontWeight: '900' },
  bannerWrapper: { paddingHorizontal: 16, marginBottom: 18 },
  heroContainer: { borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' },
  heroBox: { width: '100%', height: 180, justifyContent: 'flex-end' },
  heroShade: { padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  newBadge: { backgroundColor: '#0ea5e9', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  newBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  heroTextMain: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.8 },
  heroTextSub: { color: '#cbd5e1', fontSize: 10, marginTop: 2, fontWeight: '600' },
  btnTryContainer: { borderRadius: 18, overflow: 'hidden' },
  btnSolidWhite: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff' },
  btnLabel: { color: '#0f172a', fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8, alignItems: 'center' },
  titleMain: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  seeAllButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  seeAllText: { color: '#0ea5e9', fontSize: 11, fontWeight: '900', marginRight: 2 },
  cardCommon: { width: 125, height: 170, marginRight: 10 },
  cardInner: { flex: 1, borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardInnerActive: { borderColor: '#0ea5e9', borderWidth: 2 },
  mediaCover: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  cardOverlay: { ...StyleSheet.absoluteFillObject },
  proTagGold: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, boxShadow: '0 2px 4px rgba(180,83,9,0.4)' },
  proTextGold: { color: '#020617', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  userBadge: { position: 'absolute', bottom: 35, left: 10 },
  userAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#fff' },
  cardLabel: { position: 'absolute', bottom: 10, left: 10, color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
  playCenter: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  playButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  feedInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10 },
  feedTitle: { color: '#fff', fontSize: 11, fontWeight: '900', marginBottom: 4, letterSpacing: 0.3 },
  metricRow: { flexDirection: 'row' },
  metricItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  metricText: { color: '#fff', fontSize: 10, marginLeft: 4, fontWeight: '900' },
  dockWrapper: { position: 'absolute', bottom: 20, left: 20, right: 20, height: 64, alignItems: 'center', justifyContent: 'center' },
  dockIsland: { width: '100%', height: '100%', flexDirection: 'row', borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2, 6, 23, 0.8)' },
  dockItem: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' },
  dockIconCenter: { alignItems: 'center', justifyContent: 'center' },
  dockActiveDot: { position: 'absolute', bottom: -10, width: 4, height: 4, borderRadius: 2, backgroundColor: '#0ea5e9' },
  plusContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 12px rgba(14,165,233,0.4)' }
});